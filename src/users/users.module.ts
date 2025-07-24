import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './controllers/user.controller';
import { Exceptions } from 'src/exceptions/exceptions.execptions';

@Module({
  providers: [UsersService, PrismaService, Exceptions],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
