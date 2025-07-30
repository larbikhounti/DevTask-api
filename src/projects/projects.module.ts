import { Module } from '@nestjs/common';
import { ProjectsService } from './services/projects.service';
import { ProjectsController } from './controllers/projects.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientsService } from 'src/clients/services/clients.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService, ClientsService],
})
export class ProjectsModule {}
