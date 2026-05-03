# Nhật ký Triển khai Dự án: NestJS Stateless Supabase Backend

Báo cáo chi tiết về quá trình xây dựng hệ thống NestJS thay thế cho Hono, tập trung vào kiến trúc stateless, bảo mật Supabase và hiệu năng thời gian thực.

## 1. Tổng quan các Chapter đã hoàn thành

### Chapter 1: Nền tảng Core & Global Validation
- **Dependency:** Cài đặt các gói cốt lõi (`@nestjs/config`, `typeorm`, `class-validator`, `ioredis`,...).
- **Cấu hình Tập trung:** Xây dựng `src/core/config/configuration.ts` để quản lý biến môi trường an toàn.
- **Validation:** Thiết lập `ValidationPipe` toàn cục trong `main.ts` để đảm bảo dữ liệu đầu vào luôn sạch và đúng kiểu.

### Chapter 2: Tầng Dữ liệu (TypeORM & Supabase PostgreSQL)
- **Kết nối DB:** Tích hợp `TypeOrmModule` kết nối tới Supabase qua SSL.
- **Thực thể Todo:** Tạo `TodoEntity` với các trường `id` (UUID), `title`, `description`, và `userId`.
- **Module Hóa:** Xây dựng `TodosModule` để quản lý logic nghiệp vụ tách biệt.

### Chapter 3: Bảo mật & Stateless Authentication
- **JWT Strategy:** Triển khai `JwtStrategy` sử dụng `SUPABASE_JWT_SECRET` để xác thực người dùng mà không cần session (Stateless).
- **Guards & RBAC:**
    - `JwtAuthGuard`: Bảo vệ các route yêu cầu đăng nhập.
    - `RolesGuard` & `@Roles()`: Phân quyền người dùng dựa trên metadata trong JWT.

### Chapter 4: Real-time & Hiệu năng (Vừa hoàn thành)
- **Redis Provider:**
    - Triển khai `RedisService` dựa trên `ioredis`.
    - Tạo `RedisModule` toàn cục để cache dữ liệu và quản lý blacklist token.
- **WebSocket Gateway:**
    - Xây dựng `BrokerGateway` cho phép giao tiếp hai chiều.
    - Tính năng `subscribe-prices` để client nhận cập nhật giá thời gian thực qua room.
    - Phương thức `pushPriceUpdate` để server chủ động đẩy dữ liệu.

---

## 2. Các mốc quan trọng (Git History)
- **chapter-1:** Khởi tạo cấu hình và validation.
- **chapter-2:** Hoàn thiện TypeORM và Todo module.
- **chapter-3:** Thiết lập hệ thống bảo mật JWT.
- **chapter-4:** Tích hợp Redis và WebSockets (Đã push lên GitHub).

---

## 3. Trạng thái hiện tại
- **Source Code:** Sạch, đúng chuẩn TypeScript, đã fix lỗi `definite assignment assertion` cho WebSocket server.
- **Build:** `bun run build` vượt qua tất cả kiểm tra kiểu dữ liệu.
- **GitHub:** Mọi thay đổi đã được đẩy lên nhánh `chapter-4`.

---
*Người báo cáo: Gemini CLI Agent*
*Ngày: 04/05/2026*
