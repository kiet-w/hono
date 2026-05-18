# Ecommerce Backend - Auth & Project Setup Design

**Date:** 2026-05-18
**Status:** Approved
**Topic:** Initial Project Setup & Authentication System

## 1. Overview
This project is a NestJS-based e-commerce backend using PostgreSQL as the primary database. The first phase focuses on project initialization and a secure authentication system using JWT.

## 2. Tech Stack
- **Framework:** NestJS (v10+)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Authentication:** Passport.js with JWT Strategy
- **Security:** Bcrypt for password hashing
- **Configuration:** `@nestjs/config` for environment variables

## 3. Data Model: Prisma Schema
### User
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: Enum (ADMIN, CUSTOMER)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Profile
- `id`: UUID (Primary Key)
- `userId`: UUID (Unique, Foreign Key to User)
- `firstName`: String (Optional)
- `lastName`: String (Optional)
- `avatarUrl`: String (Optional)
- `phone`: String (Optional)

### RefreshToken
- `id`: UUID (Primary Key)
- `token`: String (Unique)
- `userId`: UUID (Foreign Key to User)
- `expiresAt`: DateTime
- `isRevoked`: Boolean (Default: false)

## 4. API Endpoints
### Auth Module
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Create a new user and profile | No |
| `POST` | `/auth/login` | Authenticate and get JWT tokens | No |
| `POST` | `/auth/refresh` | Refresh access token using refresh token | No |
| `POST` | `/auth/logout` | Revoke refresh token | Yes |
| `GET` | `/auth/me` | Get current user profile | Yes |

### User Module
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `PATCH` | `/users/profile` | Update current user profile | Yes |

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
│   ├── dto/
│   ├── entities/
│   ├── users.module.ts
│   └── users.service.ts
├── common/
│   └── decorators/ (e.g., @GetRole)
├── app.module.ts
└── main.ts
```

## 7. DTO Definitions
### RegisterDto
- `email` (string, isEmail, required)
- `password` (string, minLength: 6, required)
- `firstName` (string, optional)
- `lastName` (string, optional)

### LoginDto
- `email` (string, isEmail, required)
- `password` (string, required)

### RefreshDto
- `refreshToken` (string, required)

### UpdateProfileDto
- `firstName` (string, optional)
- `lastName` (string, optional)
- `avatarUrl` (string, isUrl, optional)
- `phone` (string, optional)
