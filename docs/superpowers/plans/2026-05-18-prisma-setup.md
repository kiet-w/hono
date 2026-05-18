# Prisma Module & Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a reusable Prisma module and service in NestJS to wrap the Prisma Client.

**Architecture:** A dedicated `PrismaModule` that exports a `PrismaService`. The `PrismaService` extends `PrismaClient` and handles the database connection on module initialization.

**Tech Stack:** NestJS, Prisma 7, TypeScript.

---

### Task 1: Generate Prisma Module and Service

**Files:**
- Create: `src/prisma/prisma.module.ts`
- Create: `src/prisma/prisma.service.ts`

- [ ] **Step 1: Generate the module**

Run: `rtk npx nest g module prisma`
Expected: `src/prisma/prisma.module.ts` is created and imported into `src/app.module.ts`.

- [ ] **Step 2: Generate the service**

Run: `rtk npx nest g service prisma --no-spec`
Expected: `src/prisma/prisma.service.ts` is created and added to `src/prisma/prisma.module.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/prisma src/app.module.ts
git commit -m "chore: generate prisma module and service"
```

### Task 2: Implement PrismaService

**Files:**
- Modify: `src/prisma/prisma.service.ts`

- [ ] **Step 1: Implement the service logic**

Replace the content of `src/prisma/prisma.service.ts` with:
```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

- [ ] **Step 2: Export PrismaService from PrismaModule**

Modify `src/prisma/prisma.module.ts`:
```typescript
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```
*Note: Making it `@Global()` is a common pattern for Prisma to avoid importing it everywhere, though the task didn't explicitly ask for `@Global()`. I will stick to what the task asked for first, but export is required.*

- [ ] **Step 3: Verify compilation**

Run: `rtk npm run build`
Expected: Successful build.

- [ ] **Step 4: Commit**

```bash
git add src/prisma
git commit -m "feat: implement prisma service and export from module"
```
