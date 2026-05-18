# Ecommerce Backend Admin, Inventory, and Promotions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build admin APIs for product management, order tracking, customers, dashboard metrics, inventory operations, and promotions.

**Architecture:** Add admin controllers under `/admin/*` protected by JWT authentication and role authorization. Keep operational features in focused services and reuse catalog, inventory, and order domain logic where possible.

**Tech Stack:** NestJS, Prisma 7, PostgreSQL, JWT auth, class-validator, Jest, Supertest.

---

## Scope

This plan depends on:
- `2026-05-18-ecommerce-01-backend-foundation-auth-schema.md`
- `2026-05-18-ecommerce-02-backend-catalog-cart-checkout.md`

This plan implements:
- Admin RBAC.
- Admin product CRUD.
- Admin order status management.
- Admin customer views.
- Dashboard summary.
- Inventory adjustments.
- Promotions.

## Admin Routes

- `GET /admin/dashboard/summary`
- `GET /admin/products`
- `POST /admin/products`
- `PATCH /admin/products/:id`
- `DELETE /admin/products/:id`
- `GET /admin/orders`
- `PATCH /admin/orders/:id/status`
- `GET /admin/customers`
- `GET /admin/customers/:id`
- `GET /admin/inventory`
- `POST /admin/inventory/adjustments`
- `GET /admin/promotions`
- `POST /admin/promotions`
- `PATCH /admin/promotions/:id`

### Task 1: Add Admin RBAC

**Files:**
- Create: `src/common/decorators/roles.decorator.ts`
- Create: `src/auth/guards/roles.guard.ts`
- Test: `src/auth/guards/roles.guard.spec.ts`

- [ ] **Step 1: Write failing roles guard tests**

Test:
- returns true when user role matches required role
- returns false or throws when user role does not match
- returns true when no roles are required

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- roles.guard --runInBand
```

Expected: FAIL because roles guard does not exist.

- [ ] **Step 3: Implement `@Roles()` decorator**

Create decorator using Nest metadata:

```ts
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

- [ ] **Step 4: Implement `RolesGuard`**

Compare required roles with `request.user.role`.

- [ ] **Step 5: Run test to verify it passes**

Run:

```bash
npm test -- roles.guard --runInBand
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/common/decorators/roles.decorator.ts src/auth/guards/roles.guard.ts src/auth/guards/roles.guard.spec.ts
git commit -m "feat: add role-based admin guard"
```

### Task 2: Admin Products

**Files:**
- Create: `src/admin/admin.module.ts`
- Create: `src/admin/admin-products.controller.ts`
- Create: `src/admin/admin-products.service.ts`
- Create: `src/admin/dto/admin-query-products.dto.ts`
- Create: `src/admin/dto/admin-create-product.dto.ts`
- Create: `src/admin/dto/admin-update-product.dto.ts`
- Modify: `src/app.module.ts`
- Test: `src/admin/admin-products.service.spec.ts`

- [ ] **Step 1: Write failing admin product tests**

Test:
- admin can create product with inventory
- admin can update product
- admin can archive product
- archived product does not appear in public listing

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- admin-products.service --runInBand
```

Expected: FAIL because admin product service does not exist.

- [ ] **Step 3: Implement admin product DTOs**

Create DTOs for:
- product name
- slug
- category id
- description
- price
- status
- image URLs
- initial inventory quantity
- low stock threshold

- [ ] **Step 4: Implement product mutations**

Methods:
- `findAllForAdmin`
- `createProduct`
- `updateProduct`
- `archiveProduct`
- `restoreProduct`

- [ ] **Step 5: Add admin product routes**

Protect with:

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
```

- [ ] **Step 6: Verify**

Run:

```bash
npm test -- admin-products.service --runInBand
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/admin src/app.module.ts
git commit -m "feat: add admin product APIs"
```

### Task 3: Admin Orders and Customers

**Files:**
- Create: `src/admin/admin-orders.controller.ts`
- Create: `src/admin/admin-orders.service.ts`
- Create: `src/admin/admin-customers.controller.ts`
- Create: `src/admin/admin-customers.service.ts`
- Create: `src/admin/dto/admin-query-orders.dto.ts`
- Create: `src/admin/dto/update-order-status.dto.ts`
- Test: `src/admin/admin-orders.service.spec.ts`

- [ ] **Step 1: Write failing order status tests**

Test allowed transitions:
- `PENDING -> CONFIRMED`
- `CONFIRMED -> PROCESSING`
- `PROCESSING -> SHIPPED`
- `SHIPPED -> DELIVERED`
- `PENDING -> CANCELLED`
- `CONFIRMED -> CANCELLED`

Test rejected transition:
- `DELIVERED -> CANCELLED`

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- admin-orders.service --runInBand
```

Expected: FAIL because order admin service does not exist.

- [ ] **Step 3: Implement order status logic**

Keep transition map inside service:

```ts
const allowedTransitions = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};
```

- [ ] **Step 4: Add admin order routes**

Routes:
- `GET /admin/orders`
- `PATCH /admin/orders/:id/status`

- [ ] **Step 5: Add admin customer routes**

Routes:
- `GET /admin/customers`
- `GET /admin/customers/:id`

- [ ] **Step 6: Verify**

Run:

```bash
npm test -- admin-orders.service --runInBand
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/admin
git commit -m "feat: add admin orders and customers"
```

### Task 4: Dashboard Summary

**Files:**
- Create: `src/admin/admin-dashboard.controller.ts`
- Create: `src/admin/admin-dashboard.service.ts`
- Test: `src/admin/admin-dashboard.service.spec.ts`

- [ ] **Step 1: Write failing dashboard tests**

Test response has:
- `revenueToday`
- `revenueThisMonth`
- `ordersByStatus`
- `lowStockProducts`
- `topProducts`
- `recentOrders`

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- admin-dashboard.service --runInBand
```

Expected: FAIL because dashboard service does not exist.

- [ ] **Step 3: Implement summary query**

Use Prisma aggregations and group-by queries. Convert decimal totals to numbers or strings consistently before returning API response.

- [ ] **Step 4: Add route**

Route:

```ts
GET /admin/dashboard/summary
```

- [ ] **Step 5: Verify**

Run:

```bash
npm test -- admin-dashboard.service --runInBand
npm run build
```

Expected: PASS and no null numeric totals.

- [ ] **Step 6: Commit**

```bash
git add src/admin
git commit -m "feat: add admin dashboard summary"
```

### Task 5: Inventory and Promotions

**Files:**
- Create: `src/inventory/inventory.module.ts`
- Create: `src/inventory/inventory.controller.ts`
- Create: `src/inventory/inventory.service.ts`
- Create: `src/inventory/dto/create-inventory-adjustment.dto.ts`
- Create: `src/promotions/promotions.module.ts`
- Create: `src/promotions/promotions.controller.ts`
- Create: `src/promotions/promotions.service.ts`
- Create: `src/promotions/dto/create-promotion.dto.ts`
- Create: `src/promotions/dto/update-promotion.dto.ts`
- Modify: `src/app.module.ts`
- Test: `src/inventory/inventory.service.spec.ts`
- Test: `src/promotions/promotions.service.spec.ts`

- [ ] **Step 1: Write failing inventory tests**

Test:
- lists inventory rows
- identifies low-stock products
- creates inventory adjustment
- creates inventory movement audit row

- [ ] **Step 2: Write failing promotion tests**

Test:
- creates promotion
- updates promotion
- rejects inactive promotion at checkout
- applies valid promotion without making total negative

- [ ] **Step 3: Run tests to verify they fail**

Run:

```bash
npm test -- inventory promotions --runInBand
```

Expected: FAIL because modules do not exist.

- [ ] **Step 4: Implement inventory module**

Routes:
- `GET /admin/inventory`
- `POST /admin/inventory/adjustments`

- [ ] **Step 5: Implement promotion module**

Routes:
- `GET /admin/promotions`
- `POST /admin/promotions`
- `PATCH /admin/promotions/:id`

- [ ] **Step 6: Wire promotion into checkout**

Checkout accepts optional `promotionCode` and validates:
- promotion exists
- promotion is active
- current date is inside start/end window
- discount cannot make `grandTotal` negative

- [ ] **Step 7: Verify**

Run:

```bash
npm test -- inventory promotions orders --runInBand
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/inventory src/promotions src/orders src/app.module.ts
git commit -m "feat: add inventory and promotions"
```

## Verification

Run:

```bash
npm test -- admin inventory promotions --runInBand
npm run build
```

Expected:
- Admin role can access admin routes.
- Customer role receives `403` on admin routes.
- Dashboard summary returns stable metrics.
- Inventory movements are auditable.
- Promotions can be applied during checkout.

