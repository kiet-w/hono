# Ecommerce Backend Foundation, Auth, and Schema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stabilize the current NestJS auth foundation and extend the Prisma schema for ecommerce entities.

**Architecture:** Keep the existing NestJS backend as the API server. First fix authentication contracts used by controllers, then add ecommerce database models and seed data so later API modules can be built safely.

**Tech Stack:** NestJS, Prisma 7, PostgreSQL, JWT auth, bcrypt, class-validator, Jest, Supertest.

---

## Scope

This plan covers:
- Auth payload consistency.
- Guarding profile routes correctly.
- Refresh-token behavior for phase 1.
- Ecommerce Prisma schema.
- Seed data for admin, customer, categories, products, and inventory.

It does not cover:
- Product APIs.
- Cart APIs.
- Checkout APIs.
- Frontend apps.

## Data Model Additions

Add ecommerce models around the existing `User`, `Profile`, and `RefreshToken` models:

- `Category`
- `Product`
- `ProductImage`
- `Inventory`
- `InventoryMovement`
- `Cart`
- `CartItem`
- `Address`
- `Order`
- `OrderItem`
- `Promotion`

Add enums:

- `ProductStatus`
- `OrderStatus`
- `PaymentStatus`
- `PaymentMethod`
- `InventoryMovementType`

Add `User` relations for:

- `cart`
- `addresses`
- `orders`
- `inventoryMovements`

### Task 1: Stabilize Auth User Payload

**Files:**
- Modify: `src/auth/strategies/jwt.strategy.ts`
- Test: `src/auth/strategies/jwt.strategy.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `src/auth/strategies/jwt.strategy.spec.ts`:

```ts
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  it('returns both id and userId from token subject', async () => {
    const strategy = new JwtStrategy({
      get: jest.fn().mockReturnValue('test-secret'),
    } as any);

    const result = await strategy.validate({
      sub: 'user-1',
      email: 'customer@example.com',
      role: 'CUSTOMER',
    });

    expect(result).toEqual({
      id: 'user-1',
      userId: 'user-1',
      email: 'customer@example.com',
      role: 'CUSTOMER',
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- jwt.strategy --runInBand
```

Expected: FAIL because `id` is missing from the validated user payload.

- [ ] **Step 3: Implement payload compatibility**

Update `src/auth/strategies/jwt.strategy.ts`:

```ts
async validate(payload: any) {
  return {
    id: payload.sub,
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- jwt.strategy --runInBand
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/auth/strategies/jwt.strategy.ts src/auth/strategies/jwt.strategy.spec.ts
git commit -m "fix: align jwt user payload"
```

### Task 2: Guard Profile Update Route

**Files:**
- Modify: `src/users/users.controller.ts`
- Test: `src/users/users.controller.spec.ts`

- [ ] **Step 1: Write the failing controller tests**

Create `src/users/users.controller.spec.ts`:

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const usersService = {
    updateProfile: jest.fn(),
  };

  beforeEach(async () => {
    usersService.updateProfile.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get(UsersController);
  });

  it('updates profile using req.user.userId', async () => {
    usersService.updateProfile.mockResolvedValue({ id: 'profile-1' });

    await controller.updateProfile(
      { user: { userId: 'user-1' } },
      { firstName: 'Ari' },
    );

    expect(usersService.updateProfile).toHaveBeenCalledWith('user-1', {
      firstName: 'Ari',
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- users.controller --runInBand
```

Expected: FAIL because the controller reads `req.user.id` or lacks the guard import.

- [ ] **Step 3: Implement guarded route**

Update `src/users/users.controller.ts`:

```ts
import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- users.controller --runInBand
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/users/users.controller.ts src/users/users.controller.spec.ts
git commit -m "fix: protect profile update route"
```

### Task 3: Stabilize Refresh Token Behavior

**Files:**
- Modify: `src/users/users.service.ts`
- Test: `src/users/users.service.spec.ts`

- [ ] **Step 1: Write the failing service test**

Create `src/users/users.service.spec.ts`:

```ts
import { UsersService } from './users.service';

describe('UsersService', () => {
  const prisma = {
    refreshToken: {
      updateMany: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(() => {
    prisma.refreshToken.updateMany.mockReset();
    prisma.refreshToken.create.mockReset();
  });

  it('revokes active refresh tokens before creating a new one', async () => {
    prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
    prisma.refreshToken.create.mockResolvedValue({ id: 'token-1' });

    const service = new UsersService(prisma as any);
    await service.updateRefreshToken('user-1', 'refresh-token');

    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', isRevoked: false },
      data: { isRevoked: true },
    });
    expect(prisma.refreshToken.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        token: 'refresh-token',
        userId: 'user-1',
      }),
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- users.service --runInBand
```

Expected: FAIL because active tokens are not revoked before token creation.

- [ ] **Step 3: Implement token revocation before create**

Update the non-null branch in `updateRefreshToken`:

```ts
await this.prisma.refreshToken.updateMany({
  where: { userId, isRevoked: false },
  data: { isRevoked: true },
});

const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + 7);

return this.prisma.refreshToken.create({
  data: {
    token: refreshToken,
    userId,
    expiresAt,
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- users.service --runInBand
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/users/users.service.ts src/users/users.service.spec.ts
git commit -m "fix: revoke old refresh tokens"
```

### Task 4: Extend Prisma Schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add enums**

Add:

```prisma
enum ProductStatus {
  DRAFT
  ACTIVE
  ARCHIVED
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  UNPAID
  PAID
  REFUNDED
  FAILED
}

enum PaymentMethod {
  COD
  MANUAL
}

enum InventoryMovementType {
  STOCK_IN
  STOCK_OUT
  ADJUSTMENT
  ORDER_RESERVED
  ORDER_RELEASED
}
```

- [ ] **Step 2: Add User relations**

Extend `User`:

```prisma
cart               Cart?
addresses          Address[]
orders             Order[]
inventoryMovements InventoryMovement[]
```

- [ ] **Step 3: Add ecommerce models**

Add the models for category, product, image, inventory, cart, address, order, order item, and promotion according to the ecommerce platform design.

- [ ] **Step 4: Format and validate schema**

Run:

```bash
npx prisma format
npx prisma validate
```

Expected: schema is formatted and valid.

- [ ] **Step 5: Create migration**

Run:

```bash
npx prisma migrate dev --name ecommerce_foundation
```

Expected: migration completes successfully.

- [ ] **Step 6: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: add ecommerce prisma schema"
```

### Task 5: Add Seed Data

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json`

- [ ] **Step 1: Add seed script**

Add to `package.json` scripts:

```json
"seed": "prisma db seed"
```

- [ ] **Step 2: Create seed data**

Create `prisma/seed.ts` that inserts:
- one admin user
- one customer user
- five categories
- twenty active products
- one inventory row per product

- [ ] **Step 3: Run seed**

Run:

```bash
npm run seed
```

Expected: seed completes and product data exists.

- [ ] **Step 4: Commit**

```bash
git add package.json prisma/seed.ts
git commit -m "chore: add ecommerce seed data"
```

## Verification

Run:

```bash
npm test -- --runInBand
npm run build
npx prisma validate
```

Expected:
- Unit tests pass.
- Backend build passes.
- Prisma schema validates.

