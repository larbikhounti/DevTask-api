import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { TasksCron } from './services/crons/tasks.cron';
import { PrismaService } from '../prisma/prisma.service';
import { Helpers } from 'src/helpers/helper.helpers';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, TasksCron, Helpers],
  exports: [TasksService],

})
export class TasksModule {}
