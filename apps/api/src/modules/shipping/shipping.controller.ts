import { Request, Response } from 'express';
import { shippingService } from './shipping.service';
import { sendSuccess } from '../../common/utils/response';

export class ShippingController {
  public async getRules(_req: Request, res: Response) {
    const rules = await shippingService.getShippingRules();
    return sendSuccess(res, rules, 'Shipping rules retrieved');
  }

  public async calculateShipping(req: Request, res: Response) {
    const { items, isFieldAgentOrder, couponFreeShipping } = req.body;
    const result = await shippingService.calculateShipping({
      items: items.map((i: any) => ({
        ...i,
        productId: BigInt(i.productId),
        vendorId: BigInt(i.vendorId),
      })),
      isFieldAgentOrder,
      couponFreeShipping,
    });
    return sendSuccess(res, result, 'Shipping calculation completed');
  }
}

export const shippingController = new ShippingController();
