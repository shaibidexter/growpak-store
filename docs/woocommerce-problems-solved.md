# WooCommerce & Dokan Problems Solved in GrowPak Store

This platform was engineered from scratch with a custom Node.js Express modular backend and Angular 21 frontend to completely eliminate the architectural and operational bottlenecks of WordPress/WooCommerce/Dokan.

| WooCommerce / Dokan Pain Point | GrowPak Store Solution |
| :--- | :--- |
| **Old orders change when product price is updated** | **Permanent price snapshotting on every order item** (`price_at_order_time`, regular price, discount, weight, variation attributes). Past orders are completely immutable. |
| **No historical price tracking** | **`product_price_history` table** records every price revision, timestamp, and user who changed it. |
| **Order exports time out on large data sets** | **DB-backed background job queue** generates exports asynchronously as CSV/XLSX without blocking the UI or timing out. |
| **Order exports lack price comparison** | **Dedicated price difference calculation** in exports comparing `price_at_order_time` vs `current_price` with difference and `price_changed` indicator. |
| **Slow admin dashboard with large order tables** | **Normalized MySQL schema with index strategy**, fulltext search, and indexed pagination replacing messy `wp_postmeta` EAV queries. |
| **Poor vendor isolation & security risks** | **Strict row-level scoping** enforced in Express domain services (`vendorId` validation), preventing vendors from ever reading or altering other vendors' data. |
| **Fragile plugin conflicts & update breakage** | **Zero third-party plugin dependency**. Every core agri-commerce feature (shipping engine, multivendor splitting, CMS, RBAC) is built natively into the platform core. |
| **Rigid role systems** | **Granular permission-based RBAC** (`roles` -> `permissions` matrix), allowing Super Admin to customize rights and convert users to Store Managers or Field Agents. |
| **Field Agent orders & complex shipping** | **Custom configurable weight-based shipping rules engine** supporting multi-slab calculation, zero shipping for Field Agent farmer orders, and free-shipping product flags. |
| **Clumsy agricultural filtering** | **Smart Crop-based filtering** (`product_crops`), dynamically grouping inputs under crops into Seeds, Fertilizers, Insecticides, Herbicides, and Fungicides. |
| **Heavy bloat and slow mobile UX for farmers** | **Lightweight Angular 21 with SSR**, signals, responsive mobile-first UI with large touch targets and bilingual English + Urdu RTL support. |
