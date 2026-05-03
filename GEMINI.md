# Hướng dẫn học NestJS cho người mới bắt đầu

Chào mừng bạn đến với thế giới của **NestJS**! Dự án này đã được chuyển đổi hoàn toàn từ Hono sang NestJS để bạn dễ dàng làm quen với kiến trúc chuẩn Enterprise.

## 1. Các khái niệm cốt lõi (Core Concepts)

### @Module (`src/app/app.module.ts`)
- **Nó là gì?**: Là "bộ não" quản lý dự án. Mọi class bạn viết ra (Controller, Service) đều phải được đăng ký vào đây thì NestJS mới biết đường mà chạy.
- **Tại sao dùng?**: Giúp chia nhỏ dự án thành các module độc lập, dễ quản lý và mở rộng.

### @Controller (`src/controllers/user.controller.ts`)
- **Nó là gì?**: Nơi tiếp nhận yêu cầu (Request) từ người dùng qua URL.
- **Cách hoạt động**: Bạn dùng các Decorator như `@Get()`, `@Post()` để định nghĩa phương thức HTTP.

### Decorators
- **@Param('id')**: Lấy tham số từ URL (ví dụ: `/users/123`).
- **@Body()**: Lấy dữ liệu người dùng gửi lên trong body của request.

## 2. Các lệnh quan trọng (Commands)

Chúng ta sử dụng **Bun** để chạy dự án vì nó nhanh và hỗ trợ TypeScript/ESM cực tốt.

- **Chạy dự án (Development)**:
  ```bash
  bun run dev
  ```
  *(Dự án sẽ tự động khởi động lại khi bạn thay đổi code)*

- **Chạy dự án (Production)**:
  ```bash
  bun run start
  ```

- **Kiểm tra các Route**:
  - Home: `GET http://localhost:3000/`
  - List Users: `GET http://localhost:3000/users`
  - Single User: `GET http://localhost:3000/users/1`

## 3. Cấu trúc thư mục mới
- `src/main.ts`: Điểm khởi đầu của ứng dụng.
- `src/app/`: Chứa Module gốc, Controller và Service mặc định.
- `src/controllers/`: Nơi chứa các logic điều hướng (Routing).

Chúc bạn học tập tốt! Nếu có thắc mắc gì cứ hỏi tui nhé.
