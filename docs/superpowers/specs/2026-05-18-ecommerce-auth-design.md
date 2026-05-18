# Ecommerce Backend - Auth & Project Setup Design

**Date:** 2026-05-18
**Status:** Approved
**Topic:** Initial Project Setup & Authentication System

## 1. Overview
This project is a NestJS-based e-commerce backend using PostgreSQL as the primary database. The first phase focuses on project initialization and a secure authentication system using JWT.

## 2. Tech Stack
- **Framework:** NestJS (v10+)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** Passport.js with JWT Strategy
- **Security:** Bcrypt for password hashing
- **Configuration:** `@nestjs/config` for environment variables

## 3. Data Model: User Entity
| Field | Type | Description |
|-------|------|-------------|
| `id` | `UUID` | Primary Key |
| `email` | `string` | Unique, primary identifier for login |
| `password` | `string` | Hashed password |
| `role` | `enum` | `'customer'` or `'admin'`. Defaults to `'customer'`. |
| `createdAt` | `Date` | Timestamp of creation |
| `updatedAt` | `Date` | Timestamp of last update |

## 4. API Endpoints
### Auth Module
- `POST /auth/register`
  - Body: `{ email, password }`
  - Action: Hashes password, saves user with 'customer' role.
- `POST /auth/login`
  - Body: `{ email, password }`
  - Action: Validates credentials, returns `{ access_token, refresh_token }`.
- `POST /auth/refresh`
  - Body: `{ refresh_token }`
  - Action: Validates refresh token, returns new `{ access_token, refresh_token }`.
- `GET /auth/me` (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Action: Returns current user profile `{ id, email, role }`.

## 5. Security & Validation
- **JWT:** 
  - `access_token`: Short-lived (e.g., 15m), contains `sub` and `role`.
  - `refresh_token`: Long-lived (e.g., 7d), stored in database (hashed) for revocation.
- **Validation:** Use `class-validator` and `class-transformer` for DTO validation.
- **Guards:** `JwtAuthGuard` for authenticated routes; `RolesGuard` for role-based access control (RBAC).

## 6. Project Structure
```text
src/
├── auth/
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── users/
│   ├── entities/
│   ├── users.module.ts
│   └── users.service.ts
├── common/
│   └── decorators/ (e.g., @GetRole)
├── app.module.ts
└── main.ts
```
