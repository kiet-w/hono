# Bug: Supabase PostgreSQL Pooler (Port 6543) Connection Issues

## Mô tả lỗi (Description)
Khi kết nối vào Supabase thông qua Transaction Pooler (cổng 6543) bằng IPv4 (`aws-0-...pooler.supabase.com`), kết nối bị từ chối với nhiều lỗi khác nhau tùy vào cấu hình.

**Lỗi hiển thị:**
1. `Error: The server does not support SSL connections`
2. `error: Tenant or user not found`
3. `Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`

## Nguyên nhân (Cause)
1. Cổng 6543 của Supabase sử dụng PgBouncer, yêu cầu chuỗi kết nối phải có tham số `?pgbouncer=true`.
2. Đối với Pooler, username phải chứa Project ID (ví dụ: `postgres.syfhnsvquehzqhphllsn`) thay vì chỉ là `postgres`.
3. SSL đôi khi không được support trực tiếp qua một số proxy node, hoặc yêu cầu bỏ qua kiểm duyệt `rejectUnauthorized: false`.

## Cách khắc phục (Solution)
Sử dụng định dạng Connection String chuẩn mực của Supabase cho Pooler và cấu hình SSL của TypeORM như sau:

**Connection String:**
`postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

**TypeORM Config:**
```typescript
ssl: {
  rejectUnauthorized: false, // Bắt buộc cho một số Supabase pooler
}
```
Hoặc an toàn nhất là sử dụng Connection String chuẩn không qua Pooler (cổng 5432) nếu không có nhu cầu chịu tải cao (Connection Pooling):
`postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres`
