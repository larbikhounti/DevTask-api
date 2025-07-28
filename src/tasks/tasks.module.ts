import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TasksCron } from './services/crons/tasks.cron';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, TasksCron],

})
export class TasksModule {}
