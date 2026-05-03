import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './core/config/configuration';
import { TodosModule } from './modules/todos/todos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          url: config.get<string>('database.url') || process.env.DATABASE_URL,
          autoLoadEntities: true,
          synchronize: true, // Dev only
          ssl: {
            rejectUnauthorized: false, // Often required for Supabase
          },
          extra: {
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
          }
        };
      },
    }),
    TodosModule,
  ],
})
export class AppModule {}