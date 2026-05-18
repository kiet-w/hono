# Bug Report: Prisma 7 Client Initialization Error

**Date:** 2026-05-18
**Issue:** `PrismaClientInitializationError: PrismaClient needs to be constructed with a non-empty, valid PrismaClientOptions`
**Environment:** NestJS + Prisma 7.8.0 + Supabase (PostgreSQL)

## 1. Triệu chứng (Symptoms)
Khi khởi chạy ứng dụng NestJS, PrismaService ném ra lỗi sau và làm crash ứng dụng:

```text
ERROR [ExceptionHandler] PrismaClientInitializationError: `PrismaClient` needs to be constructed with a non-empty, valid `PrismaClientOptions`:

new PrismaClient({ ... })
or
constructor() { super({ ... }); }
```

Mặc dù `DATABASE_URL` đã được cấu hình đúng trong `.env` và `prisma.config.ts`.

## 2. Phân tích nguyên nhân gốc rễ (Root Cause Analysis)
Lỗi này xuất phát từ những thay đổi mang tính đột phá (Breaking Changes) trong **Prisma 7**:

1.  **Loại bỏ Rust Query Engine:** Prisma 7 đã loại bỏ hoàn toàn Query Engine viết bằng Rust để chuyển sang kiến trúc hoàn toàn bằng TypeScript/JavaScript (Wasm).
2.  **Thay đổi cách cấu hình Connection:** 
    *   Trong các phiên bản trước, Prisma có thể tự tìm `DATABASE_URL` từ môi trường hoặc qua schema.
    *   Trong Prisma 7, nếu bạn di chuyển `url` ra khỏi `schema.prisma` và đưa vào `prisma.config.ts` (để bảo mật và linh hoạt hơn), Prisma Client được generate ra sẽ **không còn tự động nhận biết** được URL kết nối trực tiếp.
3.  **Bắt buộc dùng Driver Adapter:** Đối với các kết nối trực tiếp đến database (như PostgreSQL, MySQL), Prisma 7 yêu cầu bạn phải cung cấp một **Driver Adapter** (như `@prisma/adapter-pg`) thay vì chỉ truyền một chuỗi URL đơn thuần vào constructor.

## 3. Cách khắc phục (Resolution)

Để khắc phục, chúng ta cần chuyển đổi cách khởi tạo `PrismaClient` sang mô hình Driver Adapter.

### Bước 1: Cài đặt thư viện bổ sung
Cài đặt driver của PostgreSQL (`pg`) và adapter chính thức của Prisma cho nó:

```bash
npm install pg @prisma/adapter-pg
npm install -D @types/pg
```

### Bước 2: Cập nhật PrismaService
Thay vì kế thừa `PrismaClient` và để nó tự chạy, chúng ta phải tự tạo một Connection Pool và truyền vào qua Adapter.

**Trước khi sửa (Lỗi):**
```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

**Sau khi sửa (Thành công):**
```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL');
    
    // 1. Tạo Pool kết nối bằng thư viện 'pg'
    const pool = new Pool({ connectionString });
    
    // 2. Bọc Pool vào Driver Adapter của Prisma
    const adapter = new PrismaPg(pool);
    
    // 3. Truyền adapter vào constructor của lớp cha (PrismaClient)
    super({ adapter });
    
    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end(); // Đóng pool khi app tắt
  }
}
```

## 4. Bài học rút ra (Lessons Learned)
- Khi nâng cấp lên **Prisma 7**, hãy kiểm tra kỹ tài liệu về Driver Adapters.
- Prisma 7 tách biệt phần "định nghĩa schema" và phần "thực thi kết nối" rõ rệt hơn.
- Việc sử dụng Driver Adapter giúp ứng dụng kiểm soát connection pool tốt hơn và tương thích tốt hơn với môi trường Edge/Serverless.

## 5. Xác minh (Verification)
- Chạy `npm run build` để đảm bảo không lỗi type.
- Chạy `npm run start:dev`, log sẽ hiển thị `Nest application successfully started` thay vì lỗi Initialization.
