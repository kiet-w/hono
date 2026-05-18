# Bug Report: Cannot find name 'jest' in Spec files

**Date:** 2026-05-18
**Issue:** `Cannot find name 'jest'`, `describe`, `it`, or `expect` in TypeScript spec files.
**Environment:** NestJS + Jest + TypeScript (nodenext)

## 1. Triệu chứng (Symptoms)
Khi viết hoặc chạy các file kiểm thử (`.spec.ts`), trình biên dịch TypeScript báo lỗi không tìm thấy các biến toàn cục của Jest:

```text
error TS2304: Cannot find name 'jest'.
error TS2304: Cannot find name 'describe'.
error TS2304: Cannot find name 'it'.
error TS2304: Cannot find name 'expect'.
```

Mặc dù `@types/jest` đã được cài đặt trong `node_modules`.

## 2. Phân tích nguyên nhân gốc rễ (Root Cause Analysis)
Lỗi này thường xảy ra do cấu hình TypeScript (`tsconfig.json`) không tự động nạp các type definition toàn cục khi sử dụng các module resolution hiện đại (như `nodenext` hoặc `bundler`):

1.  **Module Resolution:** Khi `moduleResolution` được đặt là `nodenext`, TypeScript trở nên khắt khe hơn trong việc tìm kiếm các kiểu dữ liệu toàn cục.
2.  **Thiếu cấu hình `types`:** Nếu mảng `types` trong `compilerOptions` trống hoặc không được định nghĩa, TypeScript có thể không quét thư mục `@types/jest` để nạp các biến toàn cục.
3.  **Xung đột Global:** Trong một số dự án NestJS, nếu có sự hiện diện của nhiều thư viện test hoặc cấu hình phức tạp, việc chỉ định rõ ràng các type cần nạp là cần thiết.

## 3. Cách khắc phục (Resolution)

### Bước 1: Cập nhật `tsconfig.json`
Thêm `jest` và `node` vào mảng `types` trong phần `compilerOptions`. Việc này ép buộc TypeScript nạp các định nghĩa kiểu này ngay từ đầu.

```json
{
  "compilerOptions": {
    // ... các option khác
    "types": ["node", "jest"]
  }
}
```

### Bước 2: Cập nhật code Test (nếu cần)
Đôi khi, ngay cả khi types đã được nạp, việc ép kiểu (Type Casting) cho các hàm mock là cần thiết để tránh lỗi type-check của TypeScript.

**Ví dụ sửa code mock:**
```typescript
// Thay vì:
(bcrypt.hash as any).mockResolvedValue(hashedPassword);

// Nên dùng:
(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
```

## 4. Bài học rút ra (Lessons Learned)
- Luôn kiểm tra mảng `types` trong `tsconfig.json` khi khởi tạo dự án NestJS thủ công hoặc khi nâng cấp module resolution.
- Đảm bảo `@types/jest` và `@types/node` luôn hiện diện trong `devDependencies`.
- Việc chỉ định rõ ràng các types giúp IDE (VS Code) và trình biên dịch hoạt động ổn định hơn, tránh các lỗi "không tìm thấy tên" bí ẩn.

## 5. Xác minh (Verification)
- Mở file `.spec.ts`, các đường gợn sóng đỏ dưới `jest`, `describe` biến mất.
- Chạy `npm test` hoặc `npx jest` thành công mà không có lỗi biên dịch TypeScript.
