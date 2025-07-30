import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientsService } from 'src/clients/services/clients.service';

@Injectable()
export class ProjectsService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly clientsService: ClientsService,
  ) { }
  async create(createProjectDto: CreateProjectDto, request: Request) {

    try {
      
      await this.clientsService.findOne(createProjectDto.clientId, request);

      return this.prismaService.projects.create({
        data: createProjectDto,
        select: {
          id: true,
          name: true,
          description: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    } catch (error) {
      throw new Error(`Error creating project: ${error.message}`);

    }

  }

  findAll() {
    return `This action returns all projects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
