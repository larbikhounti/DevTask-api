
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { Helpers } from 'src/helpers/helper.helpers';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      // global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions : {
         expiresIn: configService.get<string>('JWT_EXPIRATION_TIME')
        }
      }),
    }),
  ],
  providers: [AuthService, Helpers, AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
