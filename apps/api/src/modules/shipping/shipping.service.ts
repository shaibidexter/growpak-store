import { prisma } from '../../config/db';
import { ShippingCalculationResult } from '@growpak/shared';

export interface ShippingCalculationParams {
  items: Array<{
    productId: bigint;
    vendorId: bigint;
    weightKg: number;
    quantity: number;
    freeShipping?: boolean;
  }>;
  isFieldAgentOrder?: boolean;
  couponFreeShipping?: boolean;
}

export class ShippingService {
  public async getShippingRules() {
    return prisma.shippingRule.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  public async calculateShipping(params: ShippingCalculationParams): Promise<ShippingCalculationResult> {
    // 1. Check Field Agent Override (Priority 1)
    if (params.isFieldAgentOrder) {
      return {
        totalWeightKg: this.sumTotalWeight(params.items),
        chargeableWeightKg: 0,
        freeShippingApplied: true,
        freeShippingReason: 'FIELD_AGENT_ORDER',
        shippingCostPkr: 0,
      };
    }

    // 2. Check Coupon Free Shipping (Priority 2)
    if (params.couponFreeShipping) {
      return {
        totalWeightKg: this.sumTotalWeight(params.items),
        chargeableWeightKg: 0,
        freeShippingApplied: true,
        freeShippingReason: 'COUPON_OVERRIDE',
        shippingCostPkr: 0,
      };
    }

    // 3. Filter chargeable items (exclude products flagged with freeShipping)
    let totalWeightKg = 0;
    let chargeableWeightKg = 0;

    for (const item of params.items) {
      const itemWeight = Number(item.weightKg) * item.quantity;
      totalWeightKg += itemWeight;
      if (!item.freeShipping) {
        chargeableWeightKg += itemWeight;
      }
    }

    // If all items have free shipping
    if (chargeableWeightKg === 0 && totalWeightKg > 0) {
      return {
        totalWeightKg,
        chargeableWeightKg: 0,
        freeShippingApplied: true,
        freeShippingReason: 'FREE_SHIPPING_PRODUCTS',
        shippingCostPkr: 0,
      };
    }

    // 4. Calculate based on database shipping slabs
    const rules = await this.getShippingRules();
    const cost = this.evaluateRules(chargeableWeightKg, rules);

    // Multivendor split calculation
    const vendorMap = new Map<string, { weight: number; free: boolean }>();
    for (const item of params.items) {
      const vKey = item.vendorId.toString();
      const current = vendorMap.get(vKey) || { weight: 0, free: true };
      const itemWeight = Number(item.weightKg) * item.quantity;
      current.weight += itemWeight;
      if (!item.freeShipping) current.free = false;
      vendorMap.set(vKey, current);
    }

    const vendorSplits: ShippingCalculationResult['vendorSplits'] = [];
    for (const [vId, vData] of vendorMap.entries()) {
      const splitCost = vData.free ? 0 : this.evaluateRules(vData.weight, rules);
      vendorSplits.push({
        vendorId: parseInt(vId, 10),
        vendorName: `Vendor #${vId}`,
        subOrderWeightKg: vData.weight,
        shippingCostPkr: splitCost,
      });
    }

    return {
      totalWeightKg,
      chargeableWeightKg,
      freeShippingApplied: false,
      freeShippingReason: 'NONE',
      shippingCostPkr: cost,
      vendorSplits,
    };
  }

  private sumTotalWeight(items: ShippingCalculationParams['items']): number {
    return items.reduce((acc, item) => acc + Number(item.weightKg) * item.quantity, 0);
  }

  private evaluateRules(weightKg: number, rules: any[]): number {
    if (weightKg <= 0) return 0;

    for (const rule of rules) {
      const min = Number(rule.minWeightKg);
      const max = rule.maxWeightKg !== null ? Number(rule.maxWeightKg) : Infinity;

      if (weightKg >= min && weightKg <= max) {
        const flat = Number(rule.flatChargePkr);
        const perKg = Number(rule.perKgRatePkr);
        if (perKg > 0) {
          return flat + (weightKg - min) * perKg;
        }
        return flat;
      }
    }

    // Default fallback if no rules configured: flat 250 PKR
    return 250;
  }
}

export const shippingService = new ShippingService();
