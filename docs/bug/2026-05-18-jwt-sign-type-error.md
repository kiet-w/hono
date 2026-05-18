# Bug Report: JWT Signing Type Overload Mismatch

**Date:** 2026-05-18
**Issue:** `TS2769: No overload matches this call` when calling `jwtService.signAsync`.
**Environment:** NestJS + `@nestjs/jwt` + TypeScript

## 1. Triệu chứng (Symptoms)
Khi thực hiện ký JWT (sign token) trong `AuthService`, trình biên dịch TypeScript báo lỗi không khớp với bất kỳ overload nào của hàm `signAsync`:

```text
src/auth/auth.service.ts:58:47 - error TS2769: No overload matches this call.
  Overload 3 of 3, '(payload: JwtPayloadDto, options?: JwtSignOptions | undefined): Promise<string>', gave the following error.
    Argument of type 'JwtTokenConfigDto' is not assignable to parameter of type 'JwtSignOptions'.
      Types of property 'expiresIn' are incompatible.
        Type 'string' is not assignable to type 'number | StringValue | undefined'.
```

## 2. Phân tích nguyên nhân gốc rễ (Root Cause Analysis)
Lỗi này xảy ra do sự khắt khe về kiểu dữ liệu trong thư viện `@nestjs/jwt` (phiên bản mới):

1.  **Payload không phải Plain Object:** Thư viện yêu cầu payload phải là một đối tượng thuần túy (plain object) để thực hiện serialization. Việc truyền vào một instance của class (DTO) có thể chứa các metadata hoặc phương thức ẩn không mong muốn.
2.  **Cấu hình `expiresIn` không khớp:** Thuộc tính `expiresIn` trong `JwtSignOptions` yêu cầu kiểu dữ liệu cụ thể là `number` hoặc chuỗi định dạng thời gian (`StringValue` từ thư viện `ms`). Khi định nghĩa trong DTO là `string` chung chung, TypeScript sẽ không thể tự động ép kiểu sang kiểu dữ liệu hẹp hơn của thư viện.
3.  **Cấu hình Options:** Việc truyền cả một instance của `JwtTokenConfigDto` vào tham số `options` khiến TypeScript không nhận diện được các thuộc tính hợp lệ của `JwtSignOptions`.

## 3. Cách khắc phục (Resolution)

Chúng ta cần chuyển đổi các DTO thành plain object và ép kiểu cho các thuộc tính đặc thù.

### Bước 1: Chuyển đổi Payload
Sử dụng cú pháp spread `{ ...payload }` để tạo một đối tượng thuần túy từ instance của class DTO.

### Bước 2: Tách biệt và ép kiểu Options
Tạo một đối tượng options mới từ dữ liệu trong DTO và ép kiểu cho `expiresIn`.

**Trước khi sửa (Lỗi):**
```typescript
const accessToken = await this.jwtService.signAsync(
  payload, // payload là instance của JwtPayloadDto
  this.buildJwtTokenConfigDto('JWT_SECRET', '1h'), // Trả về instance của JwtTokenConfigDto
);
```

**Sau khi sửa (Thành công):**
```typescript
const payload = this.buildJwtPayloadDto(userId, email, role);
const accessConfig = this.buildJwtTokenConfigDto('JWT_SECRET', '1h');

const accessToken = await this.jwtService.signAsync(
  { ...payload }, // Chuyển thành plain object
  {
    secret: accessConfig.secret,
    expiresIn: accessConfig.expiresIn as any, // Ép kiểu để khớp với StringValue | number
  },
);
```

## 4. Bài học rút ra (Lessons Learned)
- Các thư viện thực hiện serialization hoặc mã hóa (như JWT, Class-transformer) thường ưu tiên hoặc bắt buộc làm việc với **Plain Objects**.
- Khi gặp lỗi `No overload matches this call` với các thư viện bên thứ ba, hãy kiểm tra xem bạn có đang truyền vào một class instance thay vì một plain object hay không.
- Sử dụng `as any` hoặc `as const` một cách cẩn trọng khi làm việc với các kiểu chuỗi đặc thù (như định dạng thời gian) mà TypeScript không thể tự suy luận từ biến `string`.

## 5. Xác minh (Verification)
- Chạy `npm run build` thành công, không còn lỗi TS2769.
- Chạy `npm run test`, các bài test liên quan đến việc tạo token hoạt động chính xác.
