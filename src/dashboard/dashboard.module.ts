import { Module } from '@nestjs/common';
import { DashboardService } from './services/dashboard.service';
import { DashboardController } from './controller/dashboard.controller';
import { TasksModule } from 'src/tasks/tasks.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [TasksModule, PrismaModule],
})
export class DashboardModule {}
