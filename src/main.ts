import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // NestFactory.create() là điểm bắt đầu của mọi ứng dụng NestJS.
  // Nó khởi tạo một instance của ứng dụng dựa trên Root Module (AppModule).
  // AppModule là nơi tập trung tất cả các Controller và Provider của bạn.
  const app = await NestFactory.create(AppModule);
  
  // Lắng nghe trên port 3000. Đây là port mặc định thường dùng cho web server.
  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();
