/**
 * GrowPak Store - Core Shared Library
 * Contains universal Enums, Constants, Permission Keys, and DTOs
 */
export declare enum UserRoleType {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    VENDOR = "VENDOR",
    STORE_MANAGER = "STORE_MANAGER",
    FIELD_AGENT = "FIELD_AGENT",
    CUSTOMER = "CUSTOMER"
}
export declare enum PurchaseMode {
    CART = "CART",
    WHATSAPP = "WHATSAPP",
    CALL_FOR_PRICE = "CALL_FOR_PRICE",
    OUT_OF_STOCK = "OUT_OF_STOCK"
}
export declare enum ProductType {
    SIMPLE = "SIMPLE",
    VARIABLE = "VARIABLE",
    GROUPED = "GROUPED",
    BUNDLE = "BUNDLE"
}
export declare enum ProductStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED"
}
export declare enum OrderStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    CONFIRMED = "CONFIRMED",
    PACKED = "PACKED",
    SHIPPED = "SHIPPED",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
    FAILED = "FAILED",
    ON_HOLD = "ON_HOLD"
}
export declare enum PaymentMethod {
    COD = "COD",
    BANK_TRANSFER = "BANK_TRANSFER",
    JAZZCASH = "JAZZCASH",
    EASYPAISA = "EASYPAISA",
    CARD = "CARD"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare enum CropSeason {
    RABI = "RABI",
    KHARIF = "KHARIF",
    ZAID = "ZAID",
    ALL_SEASON = "ALL_SEASON"
}
export declare enum CropStage {
    SOWING = "SOWING",
    VEGETATIVE = "VEGETATIVE",
    FLOWERING = "FLOWERING",
    HARVEST = "HARVEST",
    POST_HARVEST = "POST_HARVEST"
}
export declare enum JobStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
export declare const PERMISSIONS: {
    readonly PRODUCT_CREATE: "product.create";
    readonly PRODUCT_READ: "product.read";
    readonly PRODUCT_UPDATE: "product.update";
    readonly PRODUCT_DELETE: "product.delete";
    readonly PRODUCT_PUBLISH: "product.publish";
    readonly PRODUCT_FREE_SHIPPING_OVERRIDE: "product.free_shipping_override";
    readonly PRODUCT_BULK_EDIT: "product.bulk_edit";
    readonly PRODUCT_IMPORT: "product.import";
    readonly PRODUCT_EXPORT: "product.export";
    readonly ORDER_READ: "order.read";
    readonly ORDER_CREATE: "order.create";
    readonly ORDER_UPDATE_STATUS: "order.update_status";
    readonly ORDER_EXPORT: "order.export";
    readonly ORDER_IMPORT: "order.import";
    readonly ORDER_CREATE_FOR_FARMER: "order.create_for_farmer";
    readonly VENDOR_MANAGE: "vendor.manage";
    readonly VENDOR_VIEW_EARNINGS: "vendor.view_earnings";
    readonly VENDOR_PAYOUT_REQUEST: "vendor.payout_request";
    readonly VENDOR_PAYOUT_APPROVE: "vendor.payout_approve";
    readonly STAFF_ASSIGN_MANAGER: "staff.assign_manager";
    readonly STAFF_ASSIGN_AGENT: "staff.assign_agent";
    readonly STAFF_VIEW_HIERARCHY: "staff.view_hierarchy";
    readonly CMS_MANAGE_MENUS: "cms.manage_menus";
    readonly CMS_MANAGE_HOMEPAGE: "cms.manage_homepage";
    readonly CMS_MANAGE_BANNERS: "cms.manage_banners";
    readonly CMS_MANAGE_PAGES: "cms.manage_pages";
    readonly SETTINGS_MANAGE: "settings.manage";
    readonly ROLES_PERMISSIONS_MANAGE: "roles_permissions.manage";
    readonly AUDIT_LOG_VIEW: "audit_log.view";
    readonly SHIPPING_RULES_MANAGE: "shipping_rules.manage";
};
export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
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
export interface WeightSlabRule {
    id: number;
    name: string;
    minWeightKg: number;
    maxWeightKg: number | null;
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
    priceDifference: number;
    priceChanged: 'Yes' | 'No';
    shippingCharge: number;
    shippingReason: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    placedByAgentName?: string;
    storeManagerName?: string;
}
//# sourceMappingURL=index.d.ts.map