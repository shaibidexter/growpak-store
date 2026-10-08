# GrowPak Store - Multivendor Agri-Commerce Platform

Production-grade, multivendor agri-commerce platform built natively from scratch for Pakistan's agricultural ecosystem. Replaces legacy WordPress/WooCommerce/Dokan with a high-performance, modular TypeScript architecture.

---

## Tech Stack Overview

- **Frontend**: **Angular 21** (Standalone components, signals, SSR, new control flow, SCSS, Tailwind CSS design tokens, bilingual English + Urdu RTL)
- **Backend**: **Node.js + Express (TypeScript)** using strict layered modular architecture: **routes → controllers → services**
- **Database**: **MySQL 8** (Native local instance, utf8mb4 collation) managed via **Prisma ORM**
- **Auth & RBAC**: JWT (access + refresh tokens), Argon2 password hashing, granular permission-based RBAC
- **Background Jobs**: In-process DB-backed queue (`jobs` table in MySQL) with pluggable BullMQ + Redis support via `REDIS_URL`
- **Shipping**: Configurable weight-based slabs engine with Field Agent and free-shipping product overrides
- **DevOps**: PM2 process clustering, Nginx reverse proxy (100% native execution, no Docker)

---

## Company Information

- **Address**: Plot 60-D, Street 7, I-10/3, Islamabad, Pakistan
- **Phone / Support**: +92-326-0409887
- **Email**: info@growtechsol.com
- **WhatsApp Support**: +92-326-0409887

---

## Quick Start (Native Local Setup)

### 1. Prerequisites
- **Node.js**: v24.x (or LTS v20.19+, v22.12+)
- **MySQL 8**: Installed and running on `127.0.0.1:3306`

### 2. Install Dependencies
All dependencies are hoisted to a single root `node_modules`:
```bash
npm install
```

### 3. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your MySQL database credentials match your local setup.

### 4. Database Setup & Seeding
```bash
npm run db:migrate
npm run db:seed
```

### 5. Start Development Servers
Start API, Web Storefront, and Admin Portal concurrently:
```bash
npm run dev
```

Or run individual services:
- **API**: `npm run dev:api` (Runs on `http://localhost:5000`, Swagger docs at `http://localhost:5000/docs`)
- **Web Storefront (SSR)**: `npm run dev:web` (Runs on `http://localhost:4200`)
- **Admin Portal**: `npm run dev:admin` (Runs on `http://localhost:4300`)

---

## Seeded Login Credentials

| Role | Identifier (Phone / Email) | Password |
| :--- | :--- | :--- |
| **Super Admin** | `+923260409887` or `admin@growpak.store` | `AdminGrowPak2026!` |
| **Vendor** | `+923001234567` or `vendor@growpak.store` | `VendorGrowPak2026!` |
| **Store Manager** | `+923007654321` or `manager@growpak.store` | `ManagerGrowPak2026!` |
| **Field Agent** | `+923009876543` or `agent@growpak.store` | `AgentGrowPak2026!` |

---

## Verification & Tests
Run backend integration and business logic tests:
```bash
npx tsx apps/api/tests/phase1.test.ts
```
