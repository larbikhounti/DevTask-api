import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { TasksCron } from './services/crons/tasks.cron';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { TasksGateway } from './services/gateways/tasks.gateway';
import { CacheModule } from '@nestjs/cache-manager';


@Module({
  controllers: [TasksController],
  providers: [TasksService,TasksCron,TasksGateway],
  imports: [PrismaModule, ProjectsModule,CacheModule.register()],
  exports: [TasksService],
})
export class TasksModule {}
