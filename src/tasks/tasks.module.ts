import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { TasksCron } from './services/crons/tasks.cron';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { Helpers } from 'src/helpers/helper.helpers';
import { TasksGateway } from './services/gateways/tasks.gateway';


@Module({
  controllers: [TasksController],
  providers: [TasksService,TasksCron, Helpers, TasksGateway],
  imports: [PrismaModule, ProjectsModule],
  exports: [TasksService],
})
export class TasksModule {}
