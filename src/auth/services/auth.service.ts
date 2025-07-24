
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { SignInRequestDto } from '../dtos/signInRequest.dto';
import { Helpers } from 'src/helpers/helper.helpers';
import { SignInResponseDto } from '../dtos/signinResponse.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly helpers: Helpers, // Assuming Helpers is used for some utility functions
  ) {}

  async signIn(signInDto: SignInRequestDto): Promise<SignInResponseDto> {

    const user  = await this.usersService.findOne(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (! await this.helpers.comparePassword(signInDto.password, user.password)) {
      throw new UnauthorizedException();
    }

    // sub is the subject of the JWT, typically the user ID
    const payload = { sub: user.id, email: user.email };
    return {
      email: user.email,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
