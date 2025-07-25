import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExceptionModule } from './exceptions/exceptions.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TasksModule } from './tasks/tasks.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10,
    }]),
    UsersModule,
    AuthModule,
    ExceptionModule,
    TasksModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
