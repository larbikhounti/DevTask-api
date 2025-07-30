import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { TasksCron } from './services/crons/tasks.cron';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, TasksCron],

})
export class TasksModule {}
