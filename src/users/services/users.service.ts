import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from '../dtos/register.dto';
import { Exceptions } from 'src/exceptions/exceptions.execptions';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly exceptions: Exceptions
    ) { }

    async create(data: RegisterUserDto): Promise<string | Error> {
        try {
            await this.prisma.user.create({
                data,
            });
            return `User created successfully`;

        } catch (error) {

            return this.exceptions.ExceptionHandler(error.code);

        }
    }

    async findOne(email: string): Promise<User | null> {
        try {
            return await this.prisma.user.findUnique({
                where: { email },
            });
        } catch (error) {
            throw new Error('Error finding user');
        }
    }
}
