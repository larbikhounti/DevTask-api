import { HttpException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Request } from 'express';
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

  incrementTimerPerSecond(task: tasks) {
    try {
      this.prisma.tasks.updateMany({
        where: { id: task.id, isTimerEnabled: true },
        data: {
          currentTimer: new Date(task.currentTimer.getTime() + 1000),
        },
      });
    } catch (error) {
      console.error('Error incrementing cron per second:', error);
      throw new HttpException('Could not increment cron per second', 500);
    }
  }

  async findEnabledTimerTasks(): Promise<tasks[]> {
        return await this.prisma.tasks.findMany({
            where: { isTimerEnabled: true },
        });

    }
}
