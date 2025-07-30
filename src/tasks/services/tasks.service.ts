import { HttpException, Injectable, Request } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { JwtPayloadType } from 'src/auth/types/jwt-payload.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { Priority, tasks } from '@prisma/client';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService, // Uncomment if using Prisma
  ) { }


  async create(createTaskDto: CreateTaskDto, request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;

    try {
      await this.prisma.tasks.create({
        data: {
          ...createTaskDto,
          userId,
        },
      });
      return { message: 'Task created successfully' };
    } catch (error) {
      console.error('Error creating task:', error);
      throw new HttpException('Could not create task', 500);
    }

  }

  async complete(id: number, request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      await this.prisma.tasks.update({
        where: { id, userId },
        data: { completed: true },
      });
      return { message: 'Task marked as completed successfully' };
    } catch (error) {
      console.error('Error completing task:', error);
      throw new HttpException('Could not complete task', 500);
    }
  }

  async updatePriority(id: number, priority: Priority, request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      await this.prisma.tasks.update({
        where: { id, userId },
        data: { priority },
      });
      return { message: 'Task priority updated successfully' };
    } catch (error) {
      console.error('Error updating task priority:', error);
      throw new HttpException('Could not update task priority', 500);
    }
  }

  async updateEstimatedTime(id: number, estimatedTime: number, request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      await this.prisma.tasks.update({
        where: { id, userId },
        data: { estimatedTime },
      });
      return { message: 'Task estimated time updated successfully' };
    } catch (error) {
      console.error('Error updating task estimated time:', error);
      throw new HttpException('Could not update task estimated time', 500);
    }
  }
  async updateDeadline(id: number, deadline: Date, request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      await this.prisma.tasks.update({
        where: { id, userId },
        data: { deadline },
      });
      return { message: 'Task deadline updated successfully' };
    } catch (error) {
      console.error('Error updating task deadline:', error);
      throw new HttpException('Could not update task deadline', 500);
    }
  }

  async findAll(request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      return await this.prisma.tasks.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          description: true,
          priority: true,
          estimatedTime: true,
          deadline: true,
          completed: true,
          createdAt: true,
          currentTimerSeconds: true, // this field should be converted to human readable format in the frontend
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
      return await this.prisma.tasks.findUnique({
        where: { id, userId },
      });
    } catch (error) {
      console.error('Error finding task:', error);
      throw new HttpException('Could not find task', 500);

    }

  }

  async update(id: number, updateTaskDto: UpdateTaskDto, request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      await this.prisma.tasks.update({
        where: { id, userId },
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
      await this.prisma.tasks.updateMany({
        where: { id: { in: tasks.map(task => task.id) }, isTimerEnabled: true },
        data: {
          currentTimerSeconds: { increment: 1 }
        },
      });
    } catch (error) {
      console.error('Error incrementing timer:', error);
      throw new HttpException('Could not increment timer', 500);
    }
  }

  async startTimer(id: number, request: Request, enable: boolean = true) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      await this.prisma.tasks.update({
        where: { id, userId },
        data: { isTimerEnabled: enable },
      });
      return { message: enable ? 'Timer enabled successfully' : 'Timer disabled successfully' };
    } catch (error) {
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
