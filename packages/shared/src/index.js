"use strict";
/**
 * GrowPak Store - Core Shared Library
 * Contains universal Enums, Constants, Permission Keys, and DTOs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSIONS = exports.JobStatus = exports.CropStage = exports.CropSeason = exports.PaymentStatus = exports.PaymentMethod = exports.OrderStatus = exports.ProductStatus = exports.ProductType = exports.PurchaseMode = exports.UserRoleType = void 0;
// ==========================================
// 1. Core Enums
// ==========================================
var UserRoleType;
(function (UserRoleType) {
    UserRoleType["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRoleType["ADMIN"] = "ADMIN";
    UserRoleType["VENDOR"] = "VENDOR";
    UserRoleType["STORE_MANAGER"] = "STORE_MANAGER";
    UserRoleType["FIELD_AGENT"] = "FIELD_AGENT";
    UserRoleType["CUSTOMER"] = "CUSTOMER";
})(UserRoleType || (exports.UserRoleType = UserRoleType = {}));
var PurchaseMode;
(function (PurchaseMode) {
    PurchaseMode["CART"] = "CART";
    PurchaseMode["WHATSAPP"] = "WHATSAPP";
    PurchaseMode["CALL_FOR_PRICE"] = "CALL_FOR_PRICE";
    PurchaseMode["OUT_OF_STOCK"] = "OUT_OF_STOCK";
})(PurchaseMode || (exports.PurchaseMode = PurchaseMode = {}));
var ProductType;
(function (ProductType) {
    ProductType["SIMPLE"] = "SIMPLE";
    ProductType["VARIABLE"] = "VARIABLE";
    ProductType["GROUPED"] = "GROUPED";
    ProductType["BUNDLE"] = "BUNDLE";
})(ProductType || (exports.ProductType = ProductType = {}));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["DRAFT"] = "DRAFT";
    ProductStatus["PENDING"] = "PENDING";
    ProductStatus["PUBLISHED"] = "PUBLISHED";
    ProductStatus["ARCHIVED"] = "ARCHIVED";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["PACKED"] = "PACKED";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["OUT_FOR_DELIVERY"] = "OUT_FOR_DELIVERY";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["REFUNDED"] = "REFUNDED";
    OrderStatus["FAILED"] = "FAILED";
    OrderStatus["ON_HOLD"] = "ON_HOLD";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["COD"] = "COD";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethod["JAZZCASH"] = "JAZZCASH";
    PaymentMethod["EASYPAISA"] = "EASYPAISA";
    PaymentMethod["CARD"] = "CARD";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var CropSeason;
(function (CropSeason) {
    CropSeason["RABI"] = "RABI";
    CropSeason["KHARIF"] = "KHARIF";
    CropSeason["ZAID"] = "ZAID";
    CropSeason["ALL_SEASON"] = "ALL_SEASON";
})(CropSeason || (exports.CropSeason = CropSeason = {}));
var CropStage;
(function (CropStage) {
    CropStage["SOWING"] = "SOWING";
    CropStage["VEGETATIVE"] = "VEGETATIVE";
    CropStage["FLOWERING"] = "FLOWERING";
    CropStage["HARVEST"] = "HARVEST";
    CropStage["POST_HARVEST"] = "POST_HARVEST";
})(CropStage || (exports.CropStage = CropStage = {}));
var JobStatus;
(function (JobStatus) {
    JobStatus["PENDING"] = "PENDING";
    JobStatus["PROCESSING"] = "PROCESSING";
    JobStatus["COMPLETED"] = "COMPLETED";
    JobStatus["FAILED"] = "FAILED";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
// ==========================================
// 2. Granular RBAC Permission Keys
// ==========================================
exports.PERMISSIONS = {
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
};
//# sourceMappingURL=index.js.map