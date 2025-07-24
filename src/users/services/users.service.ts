import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from '../dtos/register.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async create(data: RegisterUserDto): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }



}
