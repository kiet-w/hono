# Bug: NestJS Environment Variables Loading Race Condition with TypeORM

## Mô tả lỗi (Description)
Khi sử dụng `TypeOrmModule.forRootAsync` và `ConfigModule`, NestJS cố gắng khởi tạo kết nối cơ sở dữ liệu trước khi các biến môi trường (`.env`) được nạp hoàn toàn. Điều này dẫn đến việc `process.env.DATABASE_URL` trả về `undefined`, gây ra lỗi kết nối.

**Lỗi hiển thị:**
`Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string` (do driver nhận password là undefined).

## Nguyên nhân (Cause)
NestJS khởi tạo các module theo thứ tự bất đồng bộ. Dù `ConfigModule` được nạp đầu tiên, nhưng nếu không sử dụng `dotenv` một cách thủ công ở tầng cao nhất, TypeORM có thể truy xuất `process.env` khi nó còn trống.

## Cách khắc phục (Solution)
1. **Dùng dotenv sớm nhất có thể:**
   Trong file `src/main.ts`, import và cấu hình `dotenv` trước khi import bất kỳ module nào của NestJS.
   ```typescript
   import 'reflect-metadata';
   import * as dotenv from 'dotenv';
   dotenv.config(); // Load .env ngay lập tức
   import { NestFactory } from '@nestjs/core';
   ```

2. **Cấu hình rõ ràng trong AppModule:**
   Đảm bảo `ConfigModule` chỉ định rõ `envFilePath` và dùng `forRootAsync` cho `TypeOrmModule` với tham số `inject: [ConfigService]`.
