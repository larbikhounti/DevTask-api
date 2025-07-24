import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './controllers/user.controller';

@Module({
  providers: [UsersService, PrismaService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
