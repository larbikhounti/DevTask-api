import { Controller, Get, Post, Body, Param, Delete, Req, Query, Put, Patch } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Request } from 'express';
import { Priority } from '@prisma/client';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() request: Request) {
    return this.tasksService.create(createTaskDto, request);
  }

  // mark as completed
  @Get(':id/complete')
  complete(@Param('id') id: string, @Req() request: Request) {
    return this.tasksService.complete(+id, request);
  }

  // update priority
  @Put(':id/priority')
  updatePriority(@Query('id') id: string, @Query('priority') priority: Priority, @Req() request: Request) {
    return this.tasksService.updatePriority(+id, priority, request);
  }

  // update estimated time
  @Put(':id/estimated-time')
  updateEstimatedTime(@Query('id') id: string, @Query('time') time: number, @Req() request: Request) {
    return this.tasksService.updateEstimatedTime(+id, time, request);
  }

  // update deadline
  @Put(':id/deadline')
  updateDeadline(@Query('id') id: string, @Query('deadline') deadline: Date, @Req() request: Request) {
    return this.tasksService.updateDeadline(+id, deadline, request);
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
