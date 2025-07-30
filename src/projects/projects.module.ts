import { Module } from '@nestjs/common';
import { ProjectsService } from './services/projects.service';
import { ProjectsController } from './controllers/projects.controller';
import { ClientsModule } from 'src/clients/clients.module';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
  imports: [ClientsModule, PrismaModule],
})
export class ProjectsModule {}
