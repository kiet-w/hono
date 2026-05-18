# Ecommerce Backend Catalog, Cart, and Checkout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build customer-facing ecommerce APIs for product discovery, cart management, checkout, and order history.

**Architecture:** Add focused NestJS modules for products, categories, cart, orders, and payments. Keep checkout transaction-safe by using Prisma transactions for order creation, inventory reservation, and cart clearing.

**Tech Stack:** NestJS, Prisma 7, PostgreSQL, JWT auth, class-validator, Jest, Supertest.

---

## Scope

This plan depends on:
- `2026-05-18-ecommerce-01-backend-foundation-auth-schema.md`

This plan implements:
- Product listing and detail APIs.
- Category navigation API.
- Authenticated cart APIs.
- Checkout and customer order APIs.

It does not implement:
- Admin APIs.
- Frontend apps.
- Online payment gateways.

## API Routes

Public:
- `GET /products`
- `GET /products/:slug`
- `GET /categories`

Authenticated customer:
- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/:id`
- `DELETE /cart/items/:id`
- `POST /orders/checkout`
- `GET /orders/me`
- `GET /orders/:id`

### Task 1: Product and Category Modules

**Files:**
- Create: `src/products/products.module.ts`
- Create: `src/products/products.controller.ts`
- Create: `src/products/products.service.ts`
- Create: `src/products/dto/query-products.dto.ts`
- Create: `src/categories/categories.module.ts`
- Create: `src/categories/categories.controller.ts`
- Create: `src/categories/categories.service.ts`
- Modify: `src/app.module.ts`
- Test: `src/products/products.service.spec.ts`

- [ ] **Step 1: Write failing product listing tests**

Create service tests that verify:
- draft products are hidden
- archived products are hidden
- pagination returns `items` and `pagination`
- category filter uses category slug

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- products.service --runInBand
```

Expected: FAIL because `ProductsService` does not exist.

- [ ] **Step 3: Implement product query DTO**

Create `QueryProductsDto` with optional:
- `q`
- `category`
- `minPrice`
- `maxPrice`
- `inStock`
- `page`
- `limit`
- `sort`

- [ ] **Step 4: Implement product listing service**

Return:

```ts
{
  items: ProductListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

Only return products where `status` is `ACTIVE`.

- [ ] **Step 5: Implement product routes**

Add:

```ts
@Get()
findAll(@Query() query: QueryProductsDto) {}

@Get(':slug')
findBySlug(@Param('slug') slug: string) {}
```

- [ ] **Step 6: Implement categories**

`GET /categories` returns the category tree used by storefront navigation.

- [ ] **Step 7: Run tests and build**

Run:

```bash
npm test -- products.service --runInBand
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/products src/categories src/app.module.ts
git commit -m "feat: add catalog APIs"
```

### Task 2: Product Detail and Related Products

**Files:**
- Modify: `src/products/products.service.ts`
- Modify: `src/products/products.controller.ts`
- Test: `src/products/products.controller.spec.ts`

- [ ] **Step 1: Write failing detail tests**

Test:
- active product detail returns category, images, inventory availability
- missing slug returns `NotFoundException`
- draft product slug returns `NotFoundException`

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- products.controller --runInBand
```

Expected: FAIL until detail route is implemented.

- [ ] **Step 3: Implement detail service**

Load product by `slug` and `status: ACTIVE`, include:
- category
- images ordered by `sortOrder`
- inventory
- related products from same category

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- products.controller --runInBand
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/products
git commit -m "feat: add product detail API"
```

### Task 3: Cart Module

**Files:**
- Create: `src/cart/cart.module.ts`
- Create: `src/cart/cart.controller.ts`
- Create: `src/cart/cart.service.ts`
- Create: `src/cart/dto/add-cart-item.dto.ts`
- Create: `src/cart/dto/update-cart-item.dto.ts`
- Modify: `src/app.module.ts`
- Test: `src/cart/cart.service.spec.ts`

- [ ] **Step 1: Write failing cart tests**

Test:
- creates cart when customer has none
- adds product to cart
- merges duplicate product into existing cart item
- rejects quantity above available stock
- removes cart item

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- cart.service --runInBand
```

Expected: FAIL because cart module does not exist.

- [ ] **Step 3: Implement DTOs**

`AddCartItemDto`:

```ts
productId: string;
quantity: number;
```

`UpdateCartItemDto`:

```ts
quantity: number;
```

- [ ] **Step 4: Implement stock check**

Available stock:

```ts
const available = inventory.quantity - inventory.reserved;
```

Reject requests when requested quantity exceeds available stock.

- [ ] **Step 5: Implement authenticated routes**

Use `JwtAuthGuard` for:
- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/:id`
- `DELETE /cart/items/:id`

- [ ] **Step 6: Run tests and build**

Run:

```bash
npm test -- cart.service --runInBand
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/cart src/app.module.ts
git commit -m "feat: add customer cart APIs"
```

### Task 4: Checkout and Orders Module

**Files:**
- Create: `src/orders/orders.module.ts`
- Create: `src/orders/orders.controller.ts`
- Create: `src/orders/orders.service.ts`
- Create: `src/orders/dto/checkout.dto.ts`
- Create: `src/payments/payments.module.ts`
- Create: `src/payments/payments.service.ts`
- Modify: `src/app.module.ts`
- Test: `src/orders/orders.service.spec.ts`

- [ ] **Step 1: Write failing checkout tests**

Test:
- checkout fails with empty cart
- checkout fails when stock is unavailable
- checkout creates order and order items
- checkout increases reserved inventory
- checkout clears cart

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- orders.service --runInBand
```

Expected: FAIL because order service does not exist.

- [ ] **Step 3: Implement checkout DTO**

Fields:
- `shippingName`
- `shippingPhone`
- `shippingLine1`
- `shippingLine2`
- `shippingCity`
- `shippingDistrict`
- `paymentMethod`
- `promotionCode`

- [ ] **Step 4: Implement Prisma transaction**

Inside one transaction:
- load cart and items
- validate stock
- calculate subtotal, shipping fee, discount, grand total
- create order
- create order items
- reserve inventory
- clear cart

- [ ] **Step 5: Generate order number**

Use:

```text
ORD-YYYYMMDD-000001
```

- [ ] **Step 6: Add customer order routes**

Routes:
- `POST /orders/checkout`
- `GET /orders/me`
- `GET /orders/:id`

Customers can only read their own orders.

- [ ] **Step 7: Run tests and build**

Run:

```bash
npm test -- orders.service --runInBand
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/orders src/payments src/app.module.ts
git commit -m "feat: add checkout and customer orders"
```

## Verification

Run:

```bash
npm test -- products cart orders --runInBand
npm run build
```

Expected:
- Product APIs hide draft and archived products.
- Cart rejects out-of-stock quantities.
- Checkout is transaction-safe.
- Customers cannot read other users' orders.

