
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { SignInRequestDto, SignInResponseDto } from '../dtos/auth.dto';
import { Helpers } from 'src/helpers/helper.helpers';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly helpers: Helpers, // Assuming Helpers is used for some utility functions
    private readonly configService: ConfigService, // ConfigService to access environment variables
    private readonly prisma: PrismaService, // Inject PrismaService
  ) { }

  async signIn(signInDto: SignInRequestDto, response: Response): Promise<SignInResponseDto> {

    const user = await this.usersService.findOne(signInDto.email);

    if (!signInDto.email || !signInDto.password || !user) {
      throw new UnauthorizedException('Email and password are required');
    }

    if (! await this.helpers.comparePassword(signInDto.password, user.password)) {
      // this.logger.warn(`Failed login attempt with invalid password for email: ${signInDto.email}`);
      throw new UnauthorizedException();
    }


    const { accessToken, refreshToken } = await this.generateTokens(user);

    // update user refresh token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: await this.helpers.hashPassword(refreshToken), // Assuming you want to hash the password for the refresh token
      },
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: 'strict',
    });


    return {
      email: user.email,
      name: user.name,
      access_token: accessToken,
    };
  }


  // refreshToken method to generate new access token using refresh token
  async refreshToken(response: Response): Promise<{ accessToken: string }> {
    // Extract refresh token from cookies
    let refreshToken = response.req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    try {
      // Verify the refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      // Find the user associated with the refresh token
      const user = await this.usersService.findOne(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      // Check if the refresh token matches the one stored in the database
      if (!await this.helpers.comparePassword(refreshToken, user.refreshToken)) {
        // this.logger.warn(`Failed login attempt with invalid password for email: ${signInDto.email}`);
        throw new UnauthorizedException("Invalid refresh token");
      }
      // Generate new access token
      const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(user);
      
      // Update the user's refresh token in the database
      response.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        sameSite: 'strict',
      });

      return { accessToken };
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  // auth.service.ts
  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    return { accessToken, refreshToken };
  }

}
