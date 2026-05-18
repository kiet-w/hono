# Ecommerce Admin Web Dashboard with RTK Query Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the admin dashboard for tracking sales, orders, products, inventory, customers, and promotions.

**Architecture:** Create `apps/admin-web` as a Next.js operational dashboard. Use Redux Toolkit for auth/UI state and RTK Query for all admin API data. Keep pages table-first and optimized for scanning.

**Tech Stack:** Next.js, React, TypeScript, Redux Toolkit, RTK Query, React Hook Form, Zod, Tailwind CSS, Playwright.

---

## Scope

This plan depends on:
- Admin backend APIs from `2026-05-18-ecommerce-03-backend-admin-inventory-promotions.md`

This plan implements:
- Admin app scaffold.
- Admin RTK Query API slice.
- Dashboard.
- Product management.
- Order management.
- Customer, inventory, and promotion views.

## Required RTK Query Tags

- `Dashboard`
- `AdminProducts`
- `AdminOrders`
- `AdminCustomers`
- `Inventory`
- `Promotions`

### Task 1: Scaffold Admin App

**Files:**
- Create: `apps/admin-web/package.json`
- Create: `apps/admin-web/next.config.ts`
- Create: `apps/admin-web/tsconfig.json`
- Create: `apps/admin-web/src/app/layout.tsx`
- Create: `apps/admin-web/src/app/login/page.tsx`
- Create: `apps/admin-web/src/app/dashboard/page.tsx`
- Create: `apps/admin-web/src/styles/globals.css`

- [ ] **Step 1: Create app structure**

Use Next.js app router with TypeScript.

- [ ] **Step 2: Add scripts**

`apps/admin-web/package.json` scripts:

```json
{
  "dev": "next dev -p 3002",
  "build": "next build",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "test:e2e": "playwright test"
}
```

- [ ] **Step 3: Add admin layout**

Layout:
- left sidebar navigation
- top bar with admin email and logout
- main content region
- compact tables and filters

- [ ] **Step 4: Verify**

Run:

```bash
npm --prefix apps/admin-web run typecheck
```

Expected: TypeScript passes.

- [ ] **Step 5: Commit**

```bash
git add apps/admin-web
git commit -m "feat: scaffold admin dashboard"
```

### Task 2: Configure Admin Redux and RTK Query

**Files:**
- Create: `apps/admin-web/src/store/store.ts`
- Create: `apps/admin-web/src/store/provider.tsx`
- Create: `apps/admin-web/src/store/authSlice.ts`
- Create: `apps/admin-web/src/store/uiSlice.ts`
- Create: `apps/admin-web/src/store/api/baseApi.ts`
- Create: `apps/admin-web/src/store/api/adminApi.ts`
- Modify: `apps/admin-web/src/app/layout.tsx`

- [ ] **Step 1: Create auth slice**

State:

```ts
type AdminAuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  admin: { id: string; email: string; role: 'ADMIN' } | null;
};
```

- [ ] **Step 2: Create UI slice**

State:
- sidebar collapsed
- active table density
- last selected date range

- [ ] **Step 3: Create RTK Query base API**

Attach bearer token and clear auth on `401`.

- [ ] **Step 4: Create admin API endpoints**

Hooks:
- `useGetDashboardSummaryQuery`
- `useGetAdminProductsQuery`
- `useCreateAdminProductMutation`
- `useUpdateAdminProductMutation`
- `useArchiveAdminProductMutation`
- `useGetAdminOrdersQuery`
- `useUpdateOrderStatusMutation`
- `useGetAdminCustomersQuery`
- `useGetAdminCustomerByIdQuery`
- `useGetInventoryQuery`
- `useCreateInventoryAdjustmentMutation`
- `useGetPromotionsQuery`
- `useCreatePromotionMutation`
- `useUpdatePromotionMutation`

- [ ] **Step 5: Verify**

Run:

```bash
npm --prefix apps/admin-web run typecheck
```

Expected: RTK Query hooks compile.

- [ ] **Step 6: Commit**

```bash
git add apps/admin-web/src/store apps/admin-web/src/app/layout.tsx
git commit -m "feat: configure admin rtk query store"
```

### Task 3: Dashboard Page

**Files:**
- Modify: `apps/admin-web/src/app/dashboard/page.tsx`
- Create: `apps/admin-web/src/components/dashboard/MetricCards.tsx`
- Create: `apps/admin-web/src/components/dashboard/OrderStatusPanel.tsx`
- Create: `apps/admin-web/src/components/dashboard/LowStockTable.tsx`
- Create: `apps/admin-web/src/components/dashboard/RecentOrdersTable.tsx`
- Create: `apps/admin-web/src/components/dashboard/TopProductsTable.tsx`

- [ ] **Step 1: Fetch dashboard data**

Use `useGetDashboardSummaryQuery`.

- [ ] **Step 2: Render dashboard sections**

Render:
- revenue today
- revenue this month
- order status counts
- low-stock products
- top products
- recent orders

- [ ] **Step 3: Add loading and error states**

Use compact skeleton rows for tables and a retry button for query failure.

- [ ] **Step 4: Verify**

Run:

```bash
npm --prefix apps/admin-web run typecheck
npm --prefix apps/admin-web run build
```

Expected: Dashboard builds.

- [ ] **Step 5: Commit**

```bash
git add apps/admin-web/src/app/dashboard apps/admin-web/src/components/dashboard
git commit -m "feat: add admin dashboard"
```

### Task 4: Product Management

**Files:**
- Create: `apps/admin-web/src/app/products/page.tsx`
- Create: `apps/admin-web/src/app/products/new/page.tsx`
- Create: `apps/admin-web/src/app/products/[id]/page.tsx`
- Create: `apps/admin-web/src/components/products/AdminProductTable.tsx`
- Create: `apps/admin-web/src/components/products/ProductForm.tsx`

- [ ] **Step 1: Build product table**

Use `useGetAdminProductsQuery` with filters for:
- search
- category
- status
- stock state

- [ ] **Step 2: Build product form**

Use React Hook Form for create and edit.

- [ ] **Step 3: Add mutations**

Use:
- `useCreateAdminProductMutation`
- `useUpdateAdminProductMutation`
- `useArchiveAdminProductMutation`

Invalidate:
- `AdminProducts`
- `Dashboard`

- [ ] **Step 4: Verify**

Run:

```bash
npm --prefix apps/admin-web run typecheck
npm --prefix apps/admin-web run build
```

Expected: Product management builds.

- [ ] **Step 5: Commit**

```bash
git add apps/admin-web/src/app/products apps/admin-web/src/components/products
git commit -m "feat: add admin product management"
```

### Task 5: Order Management

**Files:**
- Create: `apps/admin-web/src/app/orders/page.tsx`
- Create: `apps/admin-web/src/app/orders/[id]/page.tsx`
- Create: `apps/admin-web/src/components/orders/AdminOrderTable.tsx`
- Create: `apps/admin-web/src/components/orders/AdminOrderDetail.tsx`
- Create: `apps/admin-web/src/components/orders/OrderStatusControl.tsx`

- [ ] **Step 1: Build order table**

Use `useGetAdminOrdersQuery` with status, date, and search filters.

- [ ] **Step 2: Build order detail**

Show:
- customer summary
- shipping details
- order items
- payment status
- status transition control

- [ ] **Step 3: Add status mutation**

Use `useUpdateOrderStatusMutation`.

Invalidate:
- `AdminOrders`
- `Dashboard`
- `Inventory`

- [ ] **Step 4: Verify**

Run:

```bash
npm --prefix apps/admin-web run typecheck
npm --prefix apps/admin-web run build
```

Expected: Order management builds.

- [ ] **Step 5: Commit**

```bash
git add apps/admin-web/src/app/orders apps/admin-web/src/components/orders
git commit -m "feat: add admin order management"
```

### Task 6: Customers, Inventory, and Promotions

**Files:**
- Create: `apps/admin-web/src/app/customers/page.tsx`
- Create: `apps/admin-web/src/app/customers/[id]/page.tsx`
- Create: `apps/admin-web/src/app/inventory/page.tsx`
- Create: `apps/admin-web/src/app/promotions/page.tsx`
- Create: `apps/admin-web/src/components/customers/CustomerTable.tsx`
- Create: `apps/admin-web/src/components/inventory/InventoryTable.tsx`
- Create: `apps/admin-web/src/components/inventory/InventoryAdjustmentForm.tsx`
- Create: `apps/admin-web/src/components/promotions/PromotionTable.tsx`
- Create: `apps/admin-web/src/components/promotions/PromotionForm.tsx`

- [ ] **Step 1: Build customer views**

Use:
- `useGetAdminCustomersQuery`
- `useGetAdminCustomerByIdQuery`

- [ ] **Step 2: Build inventory view**

Use:
- `useGetInventoryQuery`
- `useCreateInventoryAdjustmentMutation`

Inventory adjustment invalidates `Inventory`, `AdminProducts`, and `Dashboard`.

- [ ] **Step 3: Build promotion view**

Use:
- `useGetPromotionsQuery`
- `useCreatePromotionMutation`
- `useUpdatePromotionMutation`

Promotion mutation invalidates `Promotions`.

- [ ] **Step 4: Verify**

Run:

```bash
npm --prefix apps/admin-web run typecheck
npm --prefix apps/admin-web run build
```

Expected: Admin views build.

- [ ] **Step 5: Commit**

```bash
git add apps/admin-web/src/app/customers apps/admin-web/src/app/inventory apps/admin-web/src/app/promotions apps/admin-web/src/components/customers apps/admin-web/src/components/inventory apps/admin-web/src/components/promotions
git commit -m "feat: add admin operations views"
```

## Verification

Run:

```bash
npm --prefix apps/admin-web run typecheck
npm --prefix apps/admin-web run build
```

Expected:
- Admin app builds.
- Every server call goes through RTK Query.
- Mutations invalidate the correct tags.
- Layout is compact and operations-focused.

