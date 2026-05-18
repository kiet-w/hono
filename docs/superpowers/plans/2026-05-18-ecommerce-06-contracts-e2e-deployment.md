# Ecommerce Shared Contracts, E2E Tests, and Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add shared API contracts, end-to-end coverage, and deployment documentation for the ecommerce platform.

**Architecture:** Centralize shared TypeScript response types in `packages/api-contracts`, then use them from both frontend apps. Add backend and browser e2e tests around the highest-risk flows before writing deployment documentation.

**Tech Stack:** TypeScript, NestJS, Next.js, Redux Toolkit, RTK Query, Jest, Supertest, Playwright.

---

## Scope

This plan depends on:
- Backend customer APIs.
- Backend admin APIs.
- Client web app.
- Admin web app.

This plan implements:
- Shared contract package.
- Backend e2e tests.
- Client checkout Playwright test.
- Admin operations Playwright test.
- Deployment docs and runbook.

### Task 1: Shared API Contracts Package

**Files:**
- Create: `packages/api-contracts/package.json`
- Create: `packages/api-contracts/tsconfig.json`
- Create: `packages/api-contracts/src/index.ts`
- Create: `packages/api-contracts/src/auth.ts`
- Create: `packages/api-contracts/src/products.ts`
- Create: `packages/api-contracts/src/cart.ts`
- Create: `packages/api-contracts/src/orders.ts`
- Create: `packages/api-contracts/src/admin.ts`
- Modify: `apps/client-web/package.json`
- Modify: `apps/admin-web/package.json`

- [ ] **Step 1: Create package**

Create a TypeScript package named `@repo/api-contracts`.

- [ ] **Step 2: Add auth contract types**

Types:
- `AuthUser`
- `AuthTokens`
- `LoginRequest`
- `RegisterRequest`
- `RefreshRequest`

- [ ] **Step 3: Add product contract types**

Types:
- `CategoryDto`
- `ProductListItemDto`
- `ProductDetailDto`
- `PaginatedProductsDto`

- [ ] **Step 4: Add cart and order contract types**

Types:
- `CartDto`
- `CartItemDto`
- `CheckoutRequest`
- `OrderDto`
- `OrderItemDto`

- [ ] **Step 5: Add admin contract types**

Types:
- `AdminDashboardSummaryDto`
- `AdminProductDto`
- `AdminOrderDto`
- `AdminCustomerDto`
- `InventoryRowDto`
- `PromotionDto`

- [ ] **Step 6: Use contracts in RTK Query endpoints**

Replace local duplicate response types in both frontend apps with imports from `@repo/api-contracts`.

- [ ] **Step 7: Verify**

Run:

```bash
npm --prefix packages/api-contracts run build
npm --prefix apps/client-web run typecheck
npm --prefix apps/admin-web run typecheck
```

Expected: all typechecks pass.

- [ ] **Step 8: Commit**

```bash
git add packages/api-contracts apps/client-web/package.json apps/admin-web/package.json apps/client-web/src/store/api apps/admin-web/src/store/api
git commit -m "feat: add shared ecommerce api contracts"
```

### Task 2: Backend E2E Tests

**Files:**
- Create: `test/ecommerce.e2e-spec.ts`
- Modify: `test/jest-e2e.json`

- [ ] **Step 1: Write backend e2e test**

Cover:
- register or login customer
- list products
- add product to cart
- checkout
- view customer orders
- login admin
- update order status

- [ ] **Step 2: Run e2e test to verify failure**

Run:

```bash
npm run test:e2e -- ecommerce
```

Expected: FAIL until test database and APIs are correctly wired.

- [ ] **Step 3: Fix test setup**

Ensure e2e test:
- uses test database URL
- resets data between runs
- seeds required product/admin/customer records
- closes Nest app after tests

- [ ] **Step 4: Verify**

Run:

```bash
npm run test:e2e -- ecommerce
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add test/ecommerce.e2e-spec.ts test/jest-e2e.json
git commit -m "test: add ecommerce backend e2e coverage"
```

### Task 3: Client Checkout Playwright Test

**Files:**
- Create: `apps/client-web/playwright.config.ts`
- Create: `apps/client-web/tests/customer-checkout.spec.ts`
- Modify: `apps/client-web/package.json`

- [ ] **Step 1: Add Playwright config**

Configure test base URL:

```ts
use: {
  baseURL: process.env.CLIENT_WEB_URL ?? 'http://localhost:3001',
}
```

- [ ] **Step 2: Write checkout flow test**

Flow:
- login as seeded customer
- browse products
- open product detail
- add to cart
- open cart
- checkout with COD
- confirm order appears in account orders

- [ ] **Step 3: Run test**

Run:

```bash
npm --prefix apps/client-web run test:e2e
```

Expected: PASS when backend and client dev server are running.

- [ ] **Step 4: Commit**

```bash
git add apps/client-web/playwright.config.ts apps/client-web/tests apps/client-web/package.json
git commit -m "test: add client checkout e2e"
```

### Task 4: Admin Operations Playwright Test

**Files:**
- Create: `apps/admin-web/playwright.config.ts`
- Create: `apps/admin-web/tests/admin-operations.spec.ts`
- Modify: `apps/admin-web/package.json`

- [ ] **Step 1: Add Playwright config**

Configure test base URL:

```ts
use: {
  baseURL: process.env.ADMIN_WEB_URL ?? 'http://localhost:3002',
}
```

- [ ] **Step 2: Write admin operation test**

Flow:
- login as seeded admin
- view dashboard
- create product
- adjust inventory
- open orders
- update an order status

- [ ] **Step 3: Run test**

Run:

```bash
npm --prefix apps/admin-web run test:e2e
```

Expected: PASS when backend and admin dev server are running.

- [ ] **Step 4: Commit**

```bash
git add apps/admin-web/playwright.config.ts apps/admin-web/tests apps/admin-web/package.json
git commit -m "test: add admin operations e2e"
```

### Task 5: Deployment Documentation

**Files:**
- Create: `docs/deployment/ecommerce-platform.md`
- Create: `.env.example`
- Modify: `README.md`

- [ ] **Step 1: Document environment variables**

Backend:
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `PORT`
- `CLIENT_WEB_ORIGIN`
- `ADMIN_WEB_ORIGIN`

Frontend:
- `NEXT_PUBLIC_API_URL`

- [ ] **Step 2: Add deployment checklist**

Checklist:
- database migrated
- seed executed or admin created
- JWT secrets configured
- CORS configured for both frontend origins
- backend build passes
- client build passes
- admin build passes
- smoke tests pass

- [ ] **Step 3: Add README runbook**

Commands:

```bash
npm run start:dev
npm --prefix apps/client-web run dev
npm --prefix apps/admin-web run dev
npx prisma migrate dev
npm run seed
npm test -- --runInBand
npm run test:e2e
```

- [ ] **Step 4: Verify docs**

Run:

```bash
grep -n "DATABASE_URL" .env.example docs/deployment/ecommerce-platform.md README.md
grep -n "NEXT_PUBLIC_API_URL" .env.example docs/deployment/ecommerce-platform.md README.md
```

Expected: each required environment variable is documented.

- [ ] **Step 5: Commit**

```bash
git add docs/deployment/ecommerce-platform.md .env.example README.md
git commit -m "docs: add ecommerce deployment runbook"
```

## Verification

Run:

```bash
npm run build
npm test -- --runInBand
npm run test:e2e
npm --prefix apps/client-web run build
npm --prefix apps/admin-web run build
```

Expected:
- Backend build passes.
- Unit tests pass.
- Backend e2e tests pass.
- Client and admin builds pass.
- Browser e2e tests pass when dev servers are running.

