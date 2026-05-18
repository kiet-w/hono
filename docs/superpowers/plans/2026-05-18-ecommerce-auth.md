# Ecommerce Backend Auth Implementation Plan (Prisma + Supabase) - Revised

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize NestJS project with Supabase (PostgreSQL) and implement a complete Auth & User Profile system using Prisma.

**Architecture:** Modular NestJS architecture using Prisma ORM for database access and Passport.js for JWT.

**Tech Stack:** NestJS, Supabase (PG), Prisma 7, Passport, JWT, Bcrypt, class-validator.

---

### Task 1: Project Initialization & Prisma 7 Setup

**Files:**
- Create: `.env`, `prisma/schema.prisma`, `prisma.config.ts`
- Modify: `package.json`, `src/app.module.ts`

- [ ] **Step 1: Setup project structure**
Ensure NestJS is scaffolded: `npx @nestjs/cli new . --package-manager npm --skip-git` (if not already done).

- [ ] **Step 2: Install dependencies**
Run: `npm install @prisma/client @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer`
Run: `npm install -D prisma @types/passport-jwt @types/bcrypt`

- [ ] **Step 3: Configure Prisma 7**
Ensure `prisma.config.ts` exists and is correctly configured with `DATABASE_URL`.
In `prisma/schema.prisma`, define the full schema from the spec:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

enum UserRole {
  ADMIN
  CUSTOMER
}

model User {
  id            String         @id @default(uuid())
  email         String         @unique
  password      String
  role          UserRole       @default(CUSTOMER)
  refreshTokens RefreshToken[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  profile       Profile?
}

model Profile {
  id        String   @id @default(uuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  firstName String?
  lastName  String?
  avatarUrl String?
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  isRevoked Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

- [ ] **Step 4: Run Migration (Reset)**
Run: `npx prisma migrate dev --name init` (Allow reset if prompted to clear old schema on Supabase).

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "chore: initial nestjs and prisma setup with revised schema"
```

### Task 2: Prisma Module & Service

**Files:**
- Create: `src/prisma/prisma.module.ts`, `src/prisma/prisma.service.ts`

- [ ] **Step 1: Generate Prisma Module**
Run: `npx nest g module prisma`
Run: `npx nest g service prisma`

- [ ] **Step 2: Implement PrismaService**
Extend `PrismaClient` and implement `OnModuleInit`.

- [ ] **Step 3: Commit**
```bash
git add src/prisma
git commit -m "feat: add prisma module and service"
```

### Task 3: User Module & Profile Update

**Files:**
- Create: `src/users/users.module.ts`, `src/users/users.service.ts`, `src/users/dto/update-profile.dto.ts`

- [ ] **Step 1: Generate Users Module**
Run: `npx nest g module users`
Run: `npx nest g service users`

- [ ] **Step 2: Implement UsersService**
Implement `create` (with profile), `findOneByEmail`, `updateProfile`, and refresh token management.

- [ ] **Step 3: Implement /users/profile**
Create `PATCH /users/profile` in `UsersController`.

- [ ] **Step 4: Commit**
```bash
git add src/users
git commit -m "feat: implement users service and profile update"
```

### Task 4: Auth Module - Register, Login & Logout

**Files:**
- Create: `src/auth/auth.module.ts`, `src/auth/auth.controller.ts`, `src/auth/auth.service.ts`, `src/auth/dto/*.dto.ts`

- [ ] **Step 1: Generate Auth Module**
Run: `npx nest g module auth`
Run: `npx nest g service auth`
Run: `npx nest g controller auth`

- [ ] **Step 2: Implement Register & Login**
Implement DTOs (RegisterDto, LoginDto) and logic in `AuthService`.

- [ ] **Step 3: Implement Logout**
Implement `POST /auth/logout` to revoke refresh tokens.

- [ ] **Step 4: Commit**
```bash
git add src/auth
git commit -m "feat: implement registration, login, and logout"
```

### Task 5: Auth Module - JWT & Refresh

**Files:**
- Create: `src/auth/strategies/jwt.strategy.ts`, `src/auth/guards/jwt-auth.guard.ts`, `src/auth/dto/refresh.dto.ts`

- [ ] **Step 1: Implement Refresh Token logic**
Implement `POST /auth/refresh` using `RefreshDto`.

- [ ] **Step 2: Implement /auth/me**
Setup `JwtAuthGuard` and `GET /auth/me` endpoint.

- [ ] **Step 3: Commit**
```bash
git add src/auth
git commit -m "feat: complete auth with jwt and refresh tokens"
```
