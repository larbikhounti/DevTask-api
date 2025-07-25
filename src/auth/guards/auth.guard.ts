
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { Reflector } from '@nestjs/core';
import { promises } from 'dns';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()]
    );

    // If route is public, allow access without authentication
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const refreshToken = this.extractTokenFromCookie(request);
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }
      await this.verifyRefreshToken(refreshToken);

      const payload = await this.verifyAccessToken(token);
      if (!payload) {
        throw new UnauthorizedException('Invalid access token');
      }

      request['user'] = payload;
    } catch (error) {
      console.error('GUARD :', error);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies['refreshToken'];
  }

  private verifyRefreshToken(token: string): Promise<any> {
    try {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }
    catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private verifyAccessToken(token: string): Promise<any> {
    try {
      return this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
  } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

}
