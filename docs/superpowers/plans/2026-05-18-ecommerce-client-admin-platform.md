# Ecommerce Client and Admin Platform Plan Index

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement these plans task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Track the split implementation plans for a complete ecommerce platform with client storefront and admin dashboard.

**Architecture:** The platform is split into backend, frontend, contracts, testing, and deployment plans. Implement the plans in order because later plans depend on backend contracts and auth behavior from earlier plans.

**Tech Stack:** NestJS, Prisma 7, PostgreSQL, JWT auth, Next.js, TypeScript, Redux Toolkit, RTK Query, Tailwind CSS, Jest, Supertest, Playwright.

---

## Plan Files

1. [Backend Foundation, Auth, and Schema](./2026-05-18-ecommerce-01-backend-foundation-auth-schema.md)
2. [Backend Catalog, Cart, and Checkout](./2026-05-18-ecommerce-02-backend-catalog-cart-checkout.md)
3. [Backend Admin, Inventory, and Promotions](./2026-05-18-ecommerce-03-backend-admin-inventory-promotions.md)
4. [Client Web Storefront with RTK Query](./2026-05-18-ecommerce-04-client-web-rtk.md)
5. [Admin Web Dashboard with RTK Query](./2026-05-18-ecommerce-05-admin-web-rtk.md)
6. [Shared Contracts, E2E Tests, and Deployment](./2026-05-18-ecommerce-06-contracts-e2e-deployment.md)

## Recommended Order

- [ ] Finish plan 01 before any ecommerce API work.
- [ ] Finish plan 02 before starting the client storefront.
- [ ] Finish plan 03 before starting the admin dashboard.
- [ ] Build plan 04 and plan 05 after the backend API shape is stable.
- [ ] Finish plan 06 after both frontend apps can run against the backend.

## Cross-Plan Acceptance Criteria

- Customer can register, login, browse products, add cart items, checkout, and view orders.
- Admin can login, view dashboard, manage products, update order status, adjust inventory, and view customers.
- Client and admin frontends both use Redux Toolkit and RTK Query.
- Public endpoints do not expose draft or archived products.
- Admin endpoints reject customer users with `403`.
- Checkout is transaction-safe and prevents overselling.
- Build, unit tests, and e2e tests pass.

