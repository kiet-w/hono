# NestJS Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chuyển đổi hoàn toàn project từ Hono sang NestJS chính thống với đầy đủ chú thích hướng dẫn cho người mới bắt đầu.

**Architecture:** Sử dụng cấu trúc chuẩn của NestJS: `AppModule` làm Root Module, `UserController` xử lý logic người dùng, và `main.ts` khởi tạo ứng dụng qua `NestFactory`.

**Tech Stack:** NestJS, TypeScript, Express (platform-express).

---

### Task 1: Cập nhật Entry Point (main.ts)

**Files:**
- Modify: `src/main.ts`

- [ ] **Step 1: Thay thế code Hono bằng NestFactory**

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // NestFactory.create() là điểm bắt đầu của mọi ứng dụng NestJS.
  // Nó khởi tạo một instance của ứng dụng dựa trên Root Module (AppModule).
  // AppModule là nơi tập trung tất cả các Controller và Provider của bạn.
  const app = await NestFactory.create(AppModule);
  
  // Lắng nghe trên port 3000. Đây là port mặc định thường dùng cho web server.
  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();
```

- [ ] **Step 2: Commit**

```bash
rtk git add src/main.ts
rtk git commit -m "feat: bootstrap nestjs application in main.ts"
```

---

### Task 2: Refactor UserController sang NestJS chuẩn

**Files:**
- Modify: `src/controllers/user.controller.ts`

- [ ] **Step 1: Sử dụng decorator của @nestjs/common**

```typescript
import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';

// @Controller() định nghĩa tiền tố (prefix) cho tất cả các route trong class này.
// Nó sử dụng Metadata Reflection để lưu trữ đường dẫn cơ sở (/users).
@Controller('users')
export class UserController {
  
  // @Get() tương ứng với phương thức HTTP GET.
  // Khi bạn truy cập GET /users, hàm này sẽ được gọi.
  @Get()
  getAll() {
    // Trong NestJS, bạn chỉ cần trả về object hoặc array.
    // Framework sẽ tự động dùng JSON.stringify() và set Header Content-Type là application/json cho bạn.
    return ['Alice', 'Bob', 'Charlie'];
  }

  // @Get(':id') định nghĩa route có tham số (dynamic route).
  // Dấu hai chấm (:) báo hiệu đây là một biến trong URL.
  @Get(':id')
  getOne(@Param('id') id: string) {
    // @Param('id') là một "Param Decorator". 
    // Nó lấy giá trị từ URL gắn vào biến 'id' trong hàm.
    return { id, name: 'Alice' };
  }

  // @Post() tương ứng với phương thức HTTP POST.
  // Thường dùng để tạo mới dữ liệu.
  @Post()
  @HttpCode(HttpStatus.CREATED) // Set Status Code là 201 (Created) khi thành công.
  async create(@Body() body: any) {
    // @Body() trích xuất toàn bộ dữ liệu từ Request Body.
    // NestJS đã tích hợp sẵn body-parser nên bạn không cần cài thêm.
    return { message: 'User created!', data: body };
  }
}
```

- [ ] **Step 2: Commit**

```bash
rtk git add src/controllers/user.controller.ts
rtk git commit -m "feat: refactor user controller to use standard nestjs decorators"
```

---

### Task 3: Cập nhật AppModule để đăng ký UserController

**Files:**
- Modify: `src/app/app.module.ts`

- [ ] **Step 1: Import và thêm UserController vào danh sách controllers**

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from '../controllers/user.controller';

// @Module() là trái tim của Dependency Injection trong NestJS.
// Nó giúp NestJS hiểu được mối quan hệ giữa các Controller và Service.
@Module({
  imports: [], // Nơi chứa các Module khác mà Module này phụ thuộc vào.
  controllers: [AppController, UserController], // Nơi đăng ký các Controller để NestJS tạo Route.
  providers: [AppService], // Nơi đăng ký các Service (logic) để có thể "tiêm" (inject) vào Controller.
})
export class AppModule {}
```

- [ ] **Step 2: Commit**

```bash
rtk git add src/app/app.module.ts
rtk git commit -m "feat: register user controller in app module"
```

---

### Task 4: Dọn dẹp code cũ (Cleanup)

**Files:**
- Delete: `src/utils/decorators.ts`
- Delete: `src/utils/router.ts`

- [ ] **Step 1: Xóa các file decorator và router tự viết**

Run: `rm src/utils/decorators.ts`, `rm src/utils/router.ts`

- [ ] **Step 2: Commit**

```bash
rtk git rm src/utils/decorators.ts src/utils/router.ts
rtk git commit -m "cleanup: remove custom hono decorators and router"
```

---

### Task 5: Kiểm tra và Chạy thử (Validation)

- [ ] **Step 1: Chạy ứng dụng**

Run: `npm run start`

- [ ] **Step 2: Kiểm tra kết quả**

Dùng trình duyệt kiểm tra:
- `http://localhost:3000/` -> { message: "Hello!" }
- `http://localhost:3000/users` -> ["Alice", "Bob", "Charlie"]
