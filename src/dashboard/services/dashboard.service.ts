import { Injectable } from '@nestjs/common';
import { TasksService } from 'src/tasks/services/tasks.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayloadType } from 'src/auth/types/jwt-payload.type';
import { FilterTasksDto } from 'src/tasks/dto/filter-tasks.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly tasksService: TasksService, 
    private readonly prismaService: PrismaService
  ) {}

}
