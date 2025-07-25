import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService],

})
export class TasksModule {}
