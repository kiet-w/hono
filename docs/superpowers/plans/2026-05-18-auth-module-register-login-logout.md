# Auth Module Register, Login & Logout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement registration, login, and logout functionality in the Auth module.

**Architecture:** NestJS module with Service and Controller. Registration hashes passwords with bcrypt and creates users. Login validates credentials and returns placeholder tokens. Logout revokes refresh tokens.

**Tech Stack:** NestJS, Prisma, Bcrypt, class-validator.

---

### Task 1: Generate Auth Module components

**Files:**
- Create: `src/auth/auth.module.ts`
- Create: `src/auth/auth.service.ts`
- Create: `src/auth/auth.controller.ts`

- [ ] **Step 1: Generate components using Nest CLI**

Run: `npx nest g module auth --no-spec`
Run: `npx nest g service auth --no-spec`
Run: `npx nest g controller auth --no-spec`

*Note: We use --no-spec because we will write targeted tests in later steps.*

- [ ] **Step 2: Verify AuthModule is imported in AppModule**

Check `src/app.module.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/auth src/app.module.ts
git commit -m "feat(auth): generate auth module, service, and controller"
```

### Task 2: Implement Registration Logic

**Files:**
- Modify: `src/auth/auth.service.ts`
- Test: `src/auth/auth.service.spec.ts`

- [ ] **Step 1: Create failing test for register**

Create `src/auth/auth.service.spec.ts`:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findOneByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash password and create a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };
      const hashedPassword = 'hashedPassword';
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashedPassword));
      mockUsersService.create.mockResolvedValue({ id: '1', ...registerDto, password: hashedPassword });

      const result = await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(usersService.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
      expect(result).toEqual({ id: '1', ...registerDto, password: hashedPassword });
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/auth/auth.service.spec.ts`
Expected: FAIL (register is not a function)

- [ ] **Step 3: Implement register in AuthService**

Modify `src/auth/auth.service.ts`:
```typescript
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/auth/auth.service.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/auth/auth.service.ts src/auth/auth.service.spec.ts
git commit -m "feat(auth): implement registration logic"
```

### Task 3: Implement Login Logic

**Files:**
- Modify: `src/auth/auth.service.ts`
- Test: `src/auth/auth.service.spec.ts`

- [ ] **Step 1: Add failing test for login**

Add to `src/auth/auth.service.spec.ts`:
```typescript
  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);
      await expect(service.login({ email: 'nonexistent@example.com', password: 'password' }))
        .rejects.toThrow();
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const user = { email: 'test@example.com', password: 'hashedPassword' };
      mockUsersService.findOneByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(service.login({ email: 'test@example.com', password: 'wrongpassword' }))
        .rejects.toThrow();
    });

    it('should return placeholder tokens if password matches', async () => {
      const user = { id: '1', email: 'test@example.com', password: 'hashedPassword' };
      mockUsersService.findOneByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await service.login({ email: 'test@example.com', password: 'password123' });

      expect(result).toEqual({
        access_token: 'placeholder_access_token',
        refresh_token: 'placeholder_refresh_token',
      });
    });
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/auth/auth.service.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement login in AuthService**

Modify `src/auth/auth.service.ts`:
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: 'placeholder_access_token',
      refresh_token: 'placeholder_refresh_token',
    };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/auth/auth.service.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/auth/auth.service.ts src/auth/auth.service.spec.ts
git commit -m "feat(auth): implement login logic"
```

### Task 4: Implement Logout Logic

**Files:**
- Modify: `src/auth/auth.service.ts`
- Test: `src/auth/auth.service.spec.ts`

- [ ] **Step 1: Add failing test for logout**

Add to `src/auth/auth.service.spec.ts`:
```typescript
  describe('logout', () => {
    it('should call usersService.updateRefreshToken with revoked status', async () => {
      mockUsersService.updateRefreshToken = jest.fn().mockResolvedValue({ isRevoked: true });
      const refreshToken = 'some_token';
      
      await service.logout(refreshToken);

      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(refreshToken, { isRevoked: true });
    });
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/auth/auth.service.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement logout in AuthService**

Modify `src/auth/auth.service.ts`:
```typescript
  async logout(refreshToken: string) {
    return this.usersService.updateRefreshToken(refreshToken, { isRevoked: true });
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/auth/auth.service.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/auth/auth.service.ts src/auth/auth.service.spec.ts
git commit -m "feat(auth): implement logout logic"
```

### Task 5: Implement AuthController

**Files:**
- Modify: `src/auth/auth.controller.ts`
- Test: `src/auth/auth.controller.spec.ts`

- [ ] **Step 1: Create failing test for AuthController**

Create `src/auth/auth.controller.spec.ts`:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register', async () => {
      const dto = { email: 'test@example.com', password: 'password' };
      await controller.register(dto);
      expect(service.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call authService.login', async () => {
      const dto = { email: 'test@example.com', password: 'password' };
      await controller.login(dto);
      expect(service.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('logout', () => {
    it('should call authService.logout', async () => {
      const dto = { refreshToken: 'token' };
      await controller.logout(dto);
      expect(service.logout).toHaveBeenCalledWith(dto.refreshToken);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/auth/auth.controller.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement endpoints in AuthController**

Modify `src/auth/auth.controller.ts`:
```typescript
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() logoutDto: RefreshDto) {
    return this.authService.logout(logoutDto.refreshToken);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/auth/auth.controller.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/auth/auth.controller.ts src/auth/auth.controller.spec.ts
git commit -m "feat(auth): implement auth controller endpoints"
```

### Task 6: Final Integration Check

- [ ] **Step 1: Verify all tests pass**

Run: `npm test`

- [ ] **Step 2: Commit**

```bash
git commit -m "chore(auth): final verification of auth module"
```
