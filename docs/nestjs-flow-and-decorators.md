# Giải thích về Luồng (Flow) và Decorators trong NestJS

Tài liệu này giúp bạn hiểu cách NestJS vận hành "dưới nắp capo" thông qua ví dụ thực tế từ dự án **Todos** này.

---

## 1. Luồng hoạt động của Request (Request Flow)

Khi một người dùng gửi một yêu cầu (ví dụ: `GET /todos/1`), NestJS sẽ xử lý qua các bước sau:

### Bước 1: Khởi tạo ứng dụng (`src/main.ts`)
Ứng dụng bắt đầu tại đây. `NestFactory.create(AppModule)` sẽ khởi tạo toàn bộ hệ thống dựa trên "bản đồ" là `AppModule`.
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
```

### Bước 2: Quét Module gốc (`src/app.module.ts`)
NestJS quét qua danh sách `imports` (ở đây là `TodosModule`) để biết các module nào cần được nạp.
```typescript
@Module({
  imports: [TodosModule],
})
export class AppModule {}
```

### Bước 3: Định tuyến (Routing Layer)
Khi có Request `GET /todos/1`, NestJS tìm trong `TodosController` xem có hàm nào khớp với đường dẫn `/todos` và phương thức `GET`.

### Bước 4: Xử lý tại Controller (`src/todos/todos.controller.ts`)
Nếu khớp, NestJS sẽ gọi hàm `findOne`. Do hàm này yêu cầu `TodosService`, NestJS sẽ tự động tạo (nếu chưa có) và truyền vào thông qua **Dependency Injection**.
```typescript
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(id);
  }
}
```

### Bước 5: Trả về kết quả (Response)
Kết quả từ `todosService.findOne(id)` (thường là một object) sẽ được NestJS tự động chuyển thành JSON và gửi về cho client.

---

## 2. Các Decorators quan trọng trong dự án

Decorators (dấu `@`) giúp thêm Metadata để NestJS hiểu cách xử lý code của bạn.

### @Controller('todos')
- **Vị trí**: Trên đầu class `TodosController`.
- **Tác dụng**: Nói với NestJS: "Tất cả các route trong class này đều bắt đầu bằng `/todos`".

### @Get(':id')
- **Vị trí**: Trên hàm `findOne`.
- **Tác dụng**: Đăng ký route `GET /todos/:id`. Dấu `:id` là một biến động trên URL.

### @Param('id', ParseIntPipe)
- **Vị trí**: Trong tham số của hàm.
- **Tác dụng**: Lấy giá trị `id` từ URL. `ParseIntPipe` đảm bảo rằng `id` nhận được phải là số nguyên (nếu người dùng nhập `/todos/abc` sẽ bị lỗi ngay lập tức).

### @Body()
- **Vị trí**: Trong hàm `create` hoặc `update`.
- **Tác dụng**: Lấy toàn bộ dữ liệu người dùng gửi lên trong phần thân (Body) của Request.

---

## 3. Tại sao NestJS lại dùng Decorators?

1.  **Tính khai báo (Declarative)**: Bạn chỉ cần nói "Tôi muốn hàm này là GET route", thay vì phải viết code logic phức tạp để đăng ký route.
2.  **Tách biệt logic (Separation of Concerns)**: Code xử lý logic của bạn sạch sẽ hơn, không bị lẫn với code cấu hình server.
3.  **Tự động hóa (Automation)**: Giúp NestJS tự động hóa việc kết nối các thành phần (Dependency Injection) và thiết lập hệ thống nhanh chóng.

---

*Lưu ý: Luôn nhấn **Alt + Z** để xem tài liệu này tốt nhất nếu dòng quá dài!*
