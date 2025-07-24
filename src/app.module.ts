import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExceptionModule } from './exceptions/exceptions.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), 
    UsersModule, 
    AuthModule, 
    ExceptionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
