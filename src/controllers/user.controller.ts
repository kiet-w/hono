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
