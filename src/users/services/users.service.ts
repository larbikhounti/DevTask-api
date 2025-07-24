import { Injectable} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from '../dtos/register.dto';
import { Exceptions } from 'src/exceptions/exceptions.execptions';
import { Helpers } from 'src/helpers/helper.helpers';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly exceptions: Exceptions,
        private readonly helpers: Helpers,
    ) { }

    async create(data: RegisterUserDto): Promise<string | Error> {
        try {
            const hashedPassword = await this.helpers.hashPassword(data.password);
            await this.prisma.user.create({
                data: {
                    ...data,
                    refreshToken: '', // Initialize refreshToken as empty string
                    password: hashedPassword,
                },
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
