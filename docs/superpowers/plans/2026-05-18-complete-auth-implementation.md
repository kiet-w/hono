# Ecommerce Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the Auth and JWT implementation for the Ecommerce Backend.

**Architecture:** Use NestJS Passport with JWT strategy. Implement access and refresh tokens. Use Prisma for database interactions.

**Tech Stack:** NestJS, Passport, JWT, Prisma, Bcrypt, class-validator.

---

### Task 1: Fix UsersService.create and Implement findRefreshToken

**Files:**
- Modify: `src/users/users.service.ts`

- [ ] **Step 1: Update `create` method to accept an object and add `findRefreshToken` method**

```typescript
  async create(data: { email: string; passwordHash: string; firstName?: string; lastName?: string }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.passwordHash,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async findRefreshToken(token: string) {
    return this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/users/users.service.ts
git commit -m "refactor: update UsersService.create and add findRefreshToken"
```

### Task 2: Implement JWT Strategy and Guard

**Files:**
- Create: `src/auth/strategies/jwt.strategy.ts`
- Create: `src/auth/guards/jwt-auth.guard.ts`

- [ ] **Step 1: Create `JwtStrategy`**

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
```

- [ ] **Step 2: Create `JwtAuthGuard`**

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

- [ ] **Step 3: Commit**

```bash
git add src/auth/strategies/jwt.strategy.ts src/auth/guards/jwt-auth.guard.ts
git commit -m "feat: add JwtStrategy and JwtAuthGuard"
```

### Task 3: Complete AuthService Implementation

**Files:**
- Modify: `src/auth/auth.service.ts`

- [ ] **Step 1: Add required imports and implement `login`, `logout`, `refresh`, and helper methods**

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.usersService.create({
      email: registerDto.email,
      passwordHash: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
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

    return this.generateTokens(user.id, user.email, user.role);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async refresh(refreshToken: string) {
    const tokenData = await this.usersService.findRefreshToken(refreshToken);
    if (!tokenData || tokenData.isRevoked || tokenData.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return this.generateTokens(tokenData.userId, tokenData.user.email, tokenData.user.role);
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    await this.usersService.updateRefreshToken(userId, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/auth/auth.service.ts
git commit -m "feat: complete AuthService implementation"
```

### Task 4: Complete AuthController Implementation

**Files:**
- Modify: `src/auth/auth.controller.ts`

- [ ] **Step 1: Add required imports and implement endpoints**

```typescript
import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    return req.user;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/auth/auth.controller.ts
git commit -m "feat: complete AuthController implementation"
```

### Task 5: Configure AuthModule

**Files:**
- Modify: `src/auth/auth.module.ts`

- [ ] **Step 1: Configure `JwtModule` and add `JwtStrategy` and `ConfigService`**

```typescript
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

- [ ] **Step 2: Commit**

```bash
git add src/auth/auth.module.ts
git commit -m "feat: configure AuthModule"
```

### Task 6: Final Verification

- [ ] **Step 1: Run build to check for compilation errors**

Run: `npm run build`
Expected: Success

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: Success

- [ ] **Step 3: (Optional) Run tests if available**

Run: `npm test`
