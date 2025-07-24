
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { SignInRequestDto, SignInResponseDto } from '../dtos/auth.dto';
import { Helpers } from 'src/helpers/helper.helpers';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly helpers: Helpers, // Assuming Helpers is used for some utility functions
  ) {}

  async signIn(signInDto: SignInRequestDto): Promise<SignInResponseDto> {

    const user  = await this.usersService.findOne(signInDto.email);

    if (!signInDto.email || !signInDto.password || !user) {
      throw new UnauthorizedException('Email and password are required');
    }

    if (! await this.helpers.comparePassword(signInDto.password, user.password)) {
     // this.logger.warn(`Failed login attempt with invalid password for email: ${signInDto.email}`);
      throw new UnauthorizedException();
    }

    // sub is the subject of the JWT, typically the user ID
    const payload = { sub: user.id, email: user.email };
    return {

      email: user.email,
      name: user.name,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
