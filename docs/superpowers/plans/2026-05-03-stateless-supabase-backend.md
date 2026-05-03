# Stateless Supabase Backend Implementation Plan (Chapter-based)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a robust, stateless NestJS backend for an e-broker application, featuring Supabase Auth (JWT), TypeORM (PostgreSQL), strict data validation, real-time WebSockets, and Redis caching.

**Architecture:** 
- **Stateless:** No server-side sessions. All authentication relies on JWTs issued by Supabase.
- **Database:** TypeORM handles data persistence in Supabase PostgreSQL.
- **Validation:** Global `ValidationPipe` ensures all incoming data is strictly typed and sanitized.
- **Real-time & Cache:** WebSockets push live price updates; Redis caches heavy queries and manages a JWT blacklist.

---

## Chapter 1: Core Foundation & Global Validation
**Goal:** Setup the base infrastructure, configuration, and strict input validation.

### Task 1.1: Install Dependencies
- [ ] **Step 1: Install core packages**
Run: `bun add @nestjs/config @nestjs/typeorm typeorm pg class-validator class-transformer @nestjs/passport passport passport-jwt @types/passport-jwt @nestjs/websockets @nestjs/platform-socket.io ioredis`
- [ ] **Step 2: Commit**
`git add package.json bun.lock && git commit -m "chore: install core dependencies"`

### Task 1.2: Centralized Configuration
**Files:**
- Create: `src/core/config/configuration.ts`
- Modify: `src/app.module.ts`

- [ ] **Step 1: Create config loader**
File: `src/core/config/configuration.ts`
```typescript
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: { url: process.env.DATABASE_URL },
  supabase: { jwtSecret: process.env.SUPABASE_JWT_SECRET },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  }
});
```
- [ ] **Step 2: Initialize ConfigModule**
Modify `src/app.module.ts` to import `ConfigModule.forRoot({ load: [configuration], isGlobal: true })`.
- [ ] **Step 3: Commit**
`git add . && git commit -m "feat: setup centralized configuration"`

### Task 1.3: Global Validation Pipe
**Files:**
- Modify: `src/main.ts`

- [ ] **Step 1: Configure ValidationPipe**
File: `src/main.ts`
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```
- [ ] **Step 2: Commit**
`git add src/main.ts && git commit -m "feat: enable global validation pipe"`

### Task 1.4: Chapter 1 Wrap-up
- [ ] **Step 1: Final check**
Run: `bun run start` (Ensure server starts on port 3000)
- [ ] **Step 2: Push to GitHub**
Run: `git checkout -b chapter-1 && git push origin chapter-1`

---

## Chapter 2: Database Layer (TypeORM & Supabase)
**Goal:** Connect to Supabase PostgreSQL and define the first data entities.

### Task 2.1: TypeORM Integration
**Files:**
- Modify: `src/app.module.ts`

- [ ] **Step 1: Configure TypeOrmModule.forRootAsync**
Use `ConfigService` to get `database.url`. Set `autoLoadEntities: true` and `synchronize: true`.
- [ ] **Step 2: Commit**
`git add src/app.module.ts && git commit -m "feat: integrate TypeORM with Supabase PostgreSQL"`

### Task 2.2: Todo Entity & Module
**Files:**
- Create: `src/modules/todos/todo.entity.ts`
- Create: `src/modules/todos/todos.module.ts`

- [ ] **Step 1: Define Todo Entity**
Fields: `id` (uuid), `title` (string), `description` (text, nullable), `userId` (string, for auth link).
- [ ] **Step 2: Create TodosModule**
Import `TypeOrmModule.forFeature([Todo])`.
- [ ] **Step 3: Commit**
`git add src/modules/todos/ && git commit -m "feat: add Todo entity and module"`

### Task 2.4: Chapter 2 Wrap-up
- [ ] **Step 1: Push to GitHub**
Run: `git checkout -b chapter-2 && git push origin chapter-2`

---

## Chapter 3: Stateless Authentication & Security
**Goal:** Implement Supabase JWT verification and Role-Based Access Control.

### Task 3.1: Supabase JWT Strategy
**Files:**
- Create: `src/modules/auth/jwt.strategy.ts`
- Create: `src/modules/auth/auth.module.ts`

- [ ] **Step 1: Implement JwtStrategy**
Extract token from Auth Header. Use `supabase.jwtSecret`. Validate returns `{ userId, email, role }`.
- [ ] **Step 2: Setup AuthModule**
- [ ] **Step 3: Commit**
`git add src/modules/auth/ && git commit -m "feat: implement stateless JWT strategy"`

### Task 3.2: Security Guards & RBAC
**Files:**
- Create: `src/common/guards/jwt-auth.guard.ts`
- Create: `src/common/guards/roles.guard.ts`
- Create: `src/common/decorators/roles.decorator.ts`

- [ ] **Step 1: Create JwtAuthGuard** (Extends `AuthGuard('jwt')`)
- [ ] **Step 2: Create Roles Decorator & Guard** (Check `user.role` against required roles)
- [ ] **Step 3: Commit**
`git add . && git commit -m "feat: add JWT and RBAC guards"`

### Task 3.3: Chapter 3 Wrap-up
- [ ] **Step 1: Push to GitHub**
Run: `git checkout -b chapter-3 && git push origin chapter-3`

---

## Chapter 4: Advanced Real-time & Performance
**Goal:** Add WebSockets for live data and Redis for high-speed caching.

### Task 4.1: Redis Provider
**Files:**
- Create: `src/providers/redis/redis.service.ts`

- [ ] **Step 1: Implement RedisService**
Connect to Redis using `ConfigService`. Add basic `get`/`set` methods.
- [ ] **Step 2: Commit**
`git add src/providers/redis/ && git commit -m "feat: add global Redis provider"`

### Task 4.2: WebSockets Gateway
**Files:**
- Create: `src/gateways/broker.gateway.ts`

- [ ] **Step 1: Implement BrokerGateway**
Use `@WebSocketGateway`. Add `pushPriceUpdate` method to emit 'price-update' events.
- [ ] **Step 2: Commit**
`git add src/gateways/ && git commit -m "feat: setup WebSocket gateway"`

### Task 4.3: Chapter 4 Wrap-up
- [ ] **Step 1: Final verification of all chapters**
- [ ] **Step 2: Push to GitHub**
Run: `git checkout -b chapter-4 && git push origin chapter-4`
