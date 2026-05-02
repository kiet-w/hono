import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from '../controllers/user.controller';

// @Module() là trái tim của Dependency Injection trong NestJS.
// Nó giúp NestJS hiểu được mối quan hệ giữa các Controller và Service.
@Module({
  imports: [], // Nơi chứa các Module khác mà Module này phụ thuộc vào.
  controllers: [AppController, UserController], // Nơi đăng ký các Controller để NestJS tạo Route.
  providers: [AppService], // Nơi đăng ký các Service (logic) để có thể "tiêm" (inject) vào Controller.
})
export class AppModule {}
