import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { JwtPayloadType } from 'src/auth/types/jwt-payload.type';
import { Priority, tasks } from '@prisma/client';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { FilterTasksDto } from '../dto/filter-tasks.dto';
import { ProjectsService } from 'src/projects/services/projects.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getDateRange } from 'src/helpers/helper.helpers';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService, // Uncomment if using Prisma
    private readonly projectsService: ProjectsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }


  async create(createTaskDto: CreateTaskDto, request: Request) {

    try {
      const project = await this.projectsService.findOne(createTaskDto.projectId, request);
      if (!project) {
        throw new HttpException('Project not found', 404);
      }

      await this.prisma.tasks.create({
        data: {
          ...createTaskDto
        },
      });

      return { message: 'Task created successfully' };
    } catch (error) {
      console.error('Error creating task:', error);
      if (error instanceof HttpException) {
        throw error; // rethrow if it's already an HttpException
      }
      throw new HttpException('Could not create task', 500);
    }

  }


  async complete(id: number, request: Request) {
    try {
      const task = await this.findOne(id, request);
      if (!task) {
        throw new HttpException('Task not found', 404);
      }


      await this.prisma.tasks.update({
        where: { id },
        data: { completed: true, completedAt: new Date() },
      });
      return { message: 'Task marked as completed successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // rethrow if it's already an HttpException
      }
      throw new HttpException('Could not mark task as completed', 500);
    }
  }

  async updatePriority(id: number, priority: Priority, request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      const task = await this.findOne(id, request);
      if (!task) {
        throw new HttpException('Task not found', 404);
      }
      await this.prisma.tasks.update({
        where: { id, userId },
        data: { priority },
      });
      return { message: 'Task priority updated successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // rethrow if it's already an HttpException
      }
      throw new HttpException('Could not update task priority', 500);
    }
  }

  async updateEstimatedTime(id: number, estimatedTime: number, request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      const task = await this.findOne(id, request);
      if (!task) {
        throw new HttpException('Task not found', 404);
      }

      await this.prisma.tasks.update({
        where: { id, userId },
        data: { estimatedTime },
      });
      return { message: 'Task estimated time updated successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // rethrow if it's already an HttpException
      }
      throw new HttpException('Could not update task estimated time', 500);
    }
  }
  async updateDeadline(id: number, deadline: Date, request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      const task = await this.findOne(id, request);
      if (!task) {
        throw new HttpException('Task not found', 404);
      }
      await this.prisma.tasks.update({
        where: { id, userId },
        data: { deadline },
      });
      return { message: 'Task deadline updated successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // rethrow if it's already an HttpException
      }
      throw new HttpException('Could not update task deadline', 500);
    }
  }

  async findAll(taskFilters: FilterTasksDto, request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;

    const { dateRange, completed, priority, estimatedTime, deadline } = taskFilters;

    let filters = {

    };

    if (dateRange) {
      const dates = getDateRange(dateRange);
      filters = { ...filters, completedAt: { gte: dates.from, lte: dates.to } };
    }
    if (completed !== undefined) {
      filters = { ...filters, completed };
    }

    try {
      return await this.prisma.tasks.findMany({
        where: { userId, ...filters },
        select: {
          id: true,
          title: true,
          description: true,
          priority: true,
          estimatedTime: true,
          deadline: true,
          completed: true,
          createdAt: true,
          currentTimerSeconds: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error finding tasks:', error);
      throw new HttpException('Could not find tasks', 500);
    }
  }

  async findOne(id: number, request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      const task = await this.prisma.tasks.findUnique({
        where: { id, project: { client: { user: { id: userId } } } },
      });
      if (!task) {
        throw new HttpException('Task not found', 404);
      }
      return task;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // rethrow if it's already an HttpException
      }
      throw new HttpException('Could not find task', 500);

    }

  }


  async update(id: number, updateTaskDto: UpdateTaskDto, request: Request) {
    try {
      const task = await this.findOne(id, request);
      if (!task) {
        throw new HttpException('Task not found', 404);
      }

      await this.prisma.tasks.update({
        where: { id },
        data: updateTaskDto,
      });
      return { message: 'Task updated successfully' };
    } catch (error) {
      console.error('Error updating task:', error);
      throw new HttpException('Could not update task', 500);

    }

  }

  async remove(id: number, request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      return await this.prisma.tasks.delete({
        where: { id, userId },
      });
    } catch (error) {
      console.error('Error removing task:', error);
      throw new HttpException('Could not remove task', 500);

    }

  }

  async incrementTimerPerSecond(tasks: tasks[]) {
    try {
      const updatedTasks = await this.prisma.tasks.updateManyAndReturn({
        where: { id: { in: tasks.map(task => task.id) }, isTimerEnabled: true },
        data: {
          currentTimerSeconds: { increment: 1 }
        },
      });
      // save tasks ids and current time in cache
      await this.cacheManager.set('tasks-timer', updatedTasks.map(task => ({
        id: task.id,
        currentTimerSeconds: task.currentTimerSeconds,
        isTimerEnabled: task.isTimerEnabled
      })));
      
    } catch (error) {
      console.error('Error incrementing timer:', error);
      throw new HttpException('Could not increment timer', 500);
    }
  }

  async startTimer(id: number, request: Request, enable: boolean = true) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      const task = await this.findOne(id, request);
      if (!task) {
        throw new HttpException('Task not found', 404);
      }
      await this.prisma.tasks.update({
        where: { id },
        data: { isTimerEnabled: enable },
      });
      return { message: enable ? 'Timer enabled successfully' : 'Timer disabled successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error enabling/disabling timer:', error);
      throw new HttpException('Could not enable/disable timer', 500);
    }
  }

  async stopTimer(id: number, request: Request) {
    this.startTimer(id, request, false);
  }

  async findEnabledTimerTasks(): Promise<tasks[]> {
    return await this.prisma.tasks.findMany({
      where: { isTimerEnabled: true },
    });

  }
}
