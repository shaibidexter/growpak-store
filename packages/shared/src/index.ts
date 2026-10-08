/**
 * GrowPak Store - Core Shared Library
 * Contains universal Enums, Constants, Permission Keys, and DTOs
 */

// ==========================================
// 1. Core Enums
// ==========================================

export enum UserRoleType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  VENDOR = 'VENDOR',
  STORE_MANAGER = 'STORE_MANAGER',
  FIELD_AGENT = 'FIELD_AGENT',
  CUSTOMER = 'CUSTOMER',
}

export enum PurchaseMode {
  CART = 'CART',
  WHATSAPP = 'WHATSAPP',
  CALL_FOR_PRICE = 'CALL_FOR_PRICE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export enum ProductType {
  SIMPLE = 'SIMPLE',
  VARIABLE = 'VARIABLE',
  GROUPED = 'GROUPED',
  BUNDLE = 'BUNDLE',
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  CONFIRMED = 'CONFIRMED',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
  ON_HOLD = 'ON_HOLD',
}

export enum PaymentMethod {
  COD = 'COD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  JAZZCASH = 'JAZZCASH',
  EASYPAISA = 'EASYPAISA',
  CARD = 'CARD',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum CropSeason {
  RABI = 'RABI',
  KHARIF = 'KHARIF',
  ZAID = 'ZAID',
  ALL_SEASON = 'ALL_SEASON',
}

export enum CropStage {
  SOWING = 'SOWING',
  VEGETATIVE = 'VEGETATIVE',
  FLOWERING = 'FLOWERING',
  HARVEST = 'HARVEST',
  POST_HARVEST = 'POST_HARVEST',
}

export enum JobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// ==========================================
// 2. Granular RBAC Permission Keys
// ==========================================

export const PERMISSIONS = {
  // Product permissions
  PRODUCT_CREATE: 'product.create',
  PRODUCT_READ: 'product.read',
  PRODUCT_UPDATE: 'product.update',
  PRODUCT_DELETE: 'product.delete',
  PRODUCT_PUBLISH: 'product.publish',
  PRODUCT_FREE_SHIPPING_OVERRIDE: 'product.free_shipping_override',
  PRODUCT_BULK_EDIT: 'product.bulk_edit',
  PRODUCT_IMPORT: 'product.import',
  PRODUCT_EXPORT: 'product.export',

  // Order permissions
  ORDER_READ: 'order.read',
  ORDER_CREATE: 'order.create',
  ORDER_UPDATE_STATUS: 'order.update_status',
  ORDER_EXPORT: 'order.export',
  ORDER_IMPORT: 'order.import',
  ORDER_CREATE_FOR_FARMER: 'order.create_for_farmer',

  // Vendor permissions
  VENDOR_MANAGE: 'vendor.manage',
  VENDOR_VIEW_EARNINGS: 'vendor.view_earnings',
  VENDOR_PAYOUT_REQUEST: 'vendor.payout_request',
  VENDOR_PAYOUT_APPROVE: 'vendor.payout_approve',

  // Staff & Hierarchy
  STAFF_ASSIGN_MANAGER: 'staff.assign_manager',
  STAFF_ASSIGN_AGENT: 'staff.assign_agent',
  STAFF_VIEW_HIERARCHY: 'staff.view_hierarchy',

  // System & CMS (Super Admin exclusive by default)
  CMS_MANAGE_MENUS: 'cms.manage_menus',
  CMS_MANAGE_HOMEPAGE: 'cms.manage_homepage',
  CMS_MANAGE_BANNERS: 'cms.manage_banners',
  CMS_MANAGE_PAGES: 'cms.manage_pages',
  SETTINGS_MANAGE: 'settings.manage',
  ROLES_PERMISSIONS_MANAGE: 'roles_permissions.manage',
  AUDIT_LOG_VIEW: 'audit_log.view',
  SHIPPING_RULES_MANAGE: 'shipping_rules.manage',
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ==========================================
// 3. API Response Envelope
// ==========================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
  errors?: Record<string, string[]>;
}

// ==========================================
// 4. Shipping Calculation Interfaces
// ==========================================

export interface WeightSlabRule {
  id: number;
  name: string;
  minWeightKg: number;
  maxWeightKg: number | null; // null means unbounded (e.g. above 30kg)
  flatChargePkr: number;
  perKgRatePkr: number;
  isActive: boolean;
}

export interface ShippingCalculationResult {
  totalWeightKg: number;
  chargeableWeightKg: number;
  freeShippingApplied: boolean;
  freeShippingReason?: 'FIELD_AGENT_ORDER' | 'FREE_SHIPPING_PRODUCTS' | 'COUPON_OVERRIDE' | 'NONE';
  shippingCostPkr: number;
  vendorSplits?: Array<{
    vendorId: number;
    vendorName: string;
    subOrderWeightKg: number;
    shippingCostPkr: number;
  }>;
}

// ==========================================
// 5. Order Snapshot & Price Comparison DTOs
// ==========================================

export interface OrderItemSnapshot {
  productName: string;
  sku: string;
  imageUrl?: string;
  unitPricePaid: number;
  regularPrice: number;
  discountAmount: number;
  taxAmount: number;
  weightKg: number;
  quantity: number;
  variationData?: Record<string, any>;
  vendorId: number;
  vendorName: string;
}

export interface OrderExportComparisonRow {
  orderId: number;
  orderNumber: string;
  createdAt: string;
  orderStatus: string;
  customerName: string;
  customerPhone: string;
  city: string;
  province: string;
  vendorName: string;
  productName: string;
  sku: string;
  quantity: number;
  weightKg: number;
  priceAtOrderTime: number;
  currentPrice: number;
  priceDifference: number; // currentPrice - priceAtOrderTime
  priceChanged: 'Yes' | 'No';
  shippingCharge: number;
  shippingReason: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  placedByAgentName?: string;
  storeManagerName?: string;
}
