# Ecommerce Client Web Storefront with RTK Query Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the customer-facing ecommerce storefront with Redux Toolkit and RTK Query.

**Architecture:** Create `apps/client-web` as a Next.js app. Use RTK Query for server data and Redux slices for auth/session UI state only. Pages should consume generated hooks from API slices instead of calling `fetch` directly.

**Tech Stack:** Next.js, React, TypeScript, Redux Toolkit, RTK Query, React Hook Form, Zod, Tailwind CSS, Playwright.

---

## Scope

This plan depends on:
- Backend catalog, cart, checkout, and auth APIs.

This plan implements:
- Client app scaffold.
- RTK store.
- RTK Query API slices.
- Product browsing.
- Cart.
- Checkout.
- Account orders.

It does not implement:
- Admin dashboard.
- Payment gateway UI.

## Required RTK Query Tags

- `Auth`
- `Products`
- `Categories`
- `Cart`
- `Orders`

### Task 1: Scaffold Client App

**Files:**
- Create: `apps/client-web/package.json`
- Create: `apps/client-web/next.config.ts`
- Create: `apps/client-web/tsconfig.json`
- Create: `apps/client-web/src/app/layout.tsx`
- Create: `apps/client-web/src/app/page.tsx`
- Create: `apps/client-web/src/styles/globals.css`

- [ ] **Step 1: Create Next.js app structure**

Use the app router with TypeScript.

- [ ] **Step 2: Add scripts**

`apps/client-web/package.json` scripts:

```json
{
  "dev": "next dev -p 3001",
  "build": "next build",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "test:e2e": "playwright test"
}
```

- [ ] **Step 3: Add environment variable contract**

Use:

```text
NEXT_PUBLIC_API_URL=http://localhost:3000
```

- [ ] **Step 4: Verify scaffold**

Run:

```bash
npm --prefix apps/client-web run typecheck
```

Expected: TypeScript passes.

- [ ] **Step 5: Commit**

```bash
git add apps/client-web
git commit -m "feat: scaffold client storefront"
```

### Task 2: Configure Redux Toolkit Store

**Files:**
- Create: `apps/client-web/src/store/store.ts`
- Create: `apps/client-web/src/store/provider.tsx`
- Create: `apps/client-web/src/store/authSlice.ts`
- Create: `apps/client-web/src/store/cartSlice.ts`
- Modify: `apps/client-web/src/app/layout.tsx`

- [ ] **Step 1: Create auth slice**

State:

```ts
type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: { id: string; email: string; role: string } | null;
};
```

Reducers:
- `setCredentials`
- `clearCredentials`

- [ ] **Step 2: Create cart UI slice**

Store only UI state:
- cart drawer open/closed
- optimistic item count if needed

Do not store server cart contents here; server cart comes from RTK Query.

- [ ] **Step 3: Configure store**

Include:
- `auth`
- `cartUi`
- `baseApi.reducer`
- `baseApi.middleware`

- [ ] **Step 4: Add provider to layout**

Wrap app in Redux provider.

- [ ] **Step 5: Verify**

Run:

```bash
npm --prefix apps/client-web run typecheck
```

Expected: TypeScript passes.

- [ ] **Step 6: Commit**

```bash
git add apps/client-web/src/store apps/client-web/src/app/layout.tsx
git commit -m "feat: configure client redux store"
```

### Task 3: Add RTK Query API Slices

**Files:**
- Create: `apps/client-web/src/store/api/baseApi.ts`
- Create: `apps/client-web/src/store/api/authApi.ts`
- Create: `apps/client-web/src/store/api/productsApi.ts`
- Create: `apps/client-web/src/store/api/cartApi.ts`
- Create: `apps/client-web/src/store/api/ordersApi.ts`

- [ ] **Step 1: Implement base API**

`baseApi` should:
- use `NEXT_PUBLIC_API_URL`
- attach `Authorization: Bearer <token>`
- clear credentials on `401`
- define tags: `Auth`, `Products`, `Categories`, `Cart`, `Orders`

- [ ] **Step 2: Implement auth endpoints**

Hooks:
- `useRegisterMutation`
- `useLoginMutation`
- `useRefreshMutation`
- `useLogoutMutation`
- `useGetMeQuery`

- [ ] **Step 3: Implement catalog endpoints**

Hooks:
- `useGetProductsQuery`
- `useGetProductBySlugQuery`
- `useGetCategoriesQuery`

- [ ] **Step 4: Implement cart endpoints**

Hooks:
- `useGetCartQuery`
- `useAddCartItemMutation`
- `useUpdateCartItemMutation`
- `useRemoveCartItemMutation`

Mutations invalidate `Cart`.

- [ ] **Step 5: Implement order endpoints**

Hooks:
- `useCheckoutMutation`
- `useGetMyOrdersQuery`
- `useGetOrderByIdQuery`

Checkout invalidates `Cart` and `Orders`.

- [ ] **Step 6: Verify**

Run:

```bash
npm --prefix apps/client-web run typecheck
```

Expected: RTK Query hooks compile.

- [ ] **Step 7: Commit**

```bash
git add apps/client-web/src/store/api
git commit -m "feat: add client rtk query APIs"
```

### Task 4: Product Browsing Pages

**Files:**
- Create: `apps/client-web/src/app/products/page.tsx`
- Create: `apps/client-web/src/app/products/[slug]/page.tsx`
- Create: `apps/client-web/src/components/products/ProductGrid.tsx`
- Create: `apps/client-web/src/components/products/ProductFilters.tsx`
- Create: `apps/client-web/src/components/products/ProductDetail.tsx`

- [ ] **Step 1: Build product listing page**

Use `useGetProductsQuery` with search, category, price, stock, pagination, and sort params.

- [ ] **Step 2: Build product detail page**

Use `useGetProductBySlugQuery`.

- [ ] **Step 3: Add add-to-cart action**

Use `useAddCartItemMutation` and show loading/error states.

- [ ] **Step 4: Verify**

Run:

```bash
npm --prefix apps/client-web run typecheck
npm --prefix apps/client-web run build
```

Expected: Product pages build.

- [ ] **Step 5: Commit**

```bash
git add apps/client-web/src/app/products apps/client-web/src/components/products
git commit -m "feat: add storefront product browsing"
```

### Task 5: Cart, Checkout, and Account Orders

**Files:**
- Create: `apps/client-web/src/app/cart/page.tsx`
- Create: `apps/client-web/src/app/checkout/page.tsx`
- Create: `apps/client-web/src/app/account/orders/page.tsx`
- Create: `apps/client-web/src/app/account/orders/[id]/page.tsx`
- Create: `apps/client-web/src/components/cart/CartTable.tsx`
- Create: `apps/client-web/src/components/checkout/CheckoutForm.tsx`
- Create: `apps/client-web/src/components/orders/OrderList.tsx`
- Create: `apps/client-web/src/components/orders/OrderDetail.tsx`

- [ ] **Step 1: Build cart page**

Use:
- `useGetCartQuery`
- `useUpdateCartItemMutation`
- `useRemoveCartItemMutation`

- [ ] **Step 2: Build checkout page**

Use React Hook Form and `useCheckoutMutation`.

- [ ] **Step 3: Build order history**

Use:
- `useGetMyOrdersQuery`
- `useGetOrderByIdQuery`

- [ ] **Step 4: Verify**

Run:

```bash
npm --prefix apps/client-web run typecheck
npm --prefix apps/client-web run build
```

Expected: Cart, checkout, and orders build.

- [ ] **Step 5: Commit**

```bash
git add apps/client-web/src/app/cart apps/client-web/src/app/checkout apps/client-web/src/app/account apps/client-web/src/components/cart apps/client-web/src/components/checkout apps/client-web/src/components/orders
git commit -m "feat: add client cart checkout and orders"
```

## Verification

Run:

```bash
npm --prefix apps/client-web run typecheck
npm --prefix apps/client-web run build
```

Expected:
- Client app builds.
- RTK Query is the only server data-fetching layer.
- Cart mutations invalidate `Cart`.
- Checkout invalidates `Cart` and `Orders`.

