import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Request } from 'express';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() request: Request) {
    return this.tasksService.create(createTaskDto, request);
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.tasksService.findAll(request);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: Request) {
    return this.tasksService.findOne(+id, request);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() request: Request) {
    return this.tasksService.update(+id, updateTaskDto, request);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.tasksService.remove(+id, request);
  }
}
