import { HttpException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Request } from 'express';
import { JwtPayloadType } from 'src/auth/types/jwt-payload.type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService, // Uncomment if using Prisma
  ) { }


  async create(createTaskDto: CreateTaskDto, request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;

    try {
      return await this.prisma.tasks.create({
        data: {
          ...createTaskDto,
          userId,
        },
      });

    } catch (error) {
      console.error('Error creating task:', error);
      throw new HttpException('Could not create task', 500);
    }

  }

  findAll(request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      return this.prisma.tasks.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error finding tasks:', error);
      throw new HttpException('Could not find tasks', 500);
    }
  }

  findOne(id: number, request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      return this.prisma.tasks.findUnique({
        where: { id, userId },
      });
    } catch (error) {
      console.error('Error finding task:', error);
      throw new HttpException('Could not find task', 500);

    }

  }

  update(id: number, updateTaskDto: UpdateTaskDto, request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      return this.prisma.tasks.update({
        where: { id, userId },
        data: updateTaskDto,
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw new HttpException('Could not update task', 500);

    }

  }

  remove(id: number, request: Request) {
    const { sub: userId } = request['user'] as JwtPayloadType;
    try {
      return this.prisma.tasks.delete({
        where: { id, userId },
      });
    } catch (error) {
      console.error('Error removing task:', error);
      throw new HttpException('Could not remove task', 500);

    }

  }
}
