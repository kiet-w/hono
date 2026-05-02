# Spec: NestJS Migration Design

## 1. Mục tiêu (Goals)
- Chuyển đổi toàn bộ dự án từ Hono + Custom Decorators sang Framework **NestJS** chính thống.
- Cung cấp mã nguồn dễ hiểu với chú thích chi tiết để người mới bắt đầu có thể học tập.
- Đảm bảo project chạy được ngay với `npm run start`.

## 2. Phạm vi thay đổi (Scope)

### A. Entry Point (`src/main.ts`)
- Thay thế `Hono` bằng `NestFactory`.
- Sử dụng `platform-express` làm nền tảng (mặc định của NestJS).

### B. Module & Controller
- **AppModule**: Đóng vai trò Root Module, kết nối `AppController`, `AppService` và `UserController`.
- **UserController**: Chuyển đổi từ `utils/decorators` sang `@nestjs/common`.
    - Sử dụng `@Controller('/users')`.
    - Sử dụng `@Get()`, `@Post()`, `@Param()`, `@Body()`.

### C. Dọn dẹp (Cleanup)
- Xóa bỏ `src/utils/decorators.ts` và `src/utils/router.ts` (không còn cần thiết).
- Xóa bỏ các file liên quan đến Hono nếu có.

## 3. Kiến trúc (Architecture)
- **Controllers**: Xử lý HTTP requests (Routing).
- **Providers (Services)**: Xử lý logic nghiệp vụ (Business Logic).
- **Modules**: Đóng gói các thành phần liên quan.

## 4. Kế hoạch thực hiện (Execution Plan)
1. Cập nhật `main.ts` để khởi tạo NestJS.
2. Refactor `UserController` sang chuẩn NestJS.
3. Cập nhật `AppModule` để đăng ký các thành phần.
4. Xóa code cũ không dùng tới.
5. Chạy thử và kiểm tra các route: `/`, `/users`, `/users/:id`.

## 5. Tiêu chí thành công (Success Criteria)
- `npm run start` khởi chạy thành công trên port 3000.
- Các API trả về đúng kết quả như dự kiến.
- Code có đầy đủ comment giải thích "tại sao" và "như thế nào".
