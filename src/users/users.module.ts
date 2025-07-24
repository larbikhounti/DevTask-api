import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './controllers/user.controller';
import { Exceptions } from 'src/exceptions/exceptions.execptions';
import { Helpers } from 'src/helpers/helper.helpers';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Module({
  providers: [UsersService, PrismaService, Exceptions, Helpers],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
