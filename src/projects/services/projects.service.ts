import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientsService } from 'src/clients/services/clients.service';
import { JwtPayloadType } from 'src/auth/types/jwt-payload.type';

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

 async findAll() {
    
  }

async findOne(id: number, request: Request) {
  try {
    const { sub: userId } = request['user'] as JwtPayloadType;

    const project = await this.prismaService.projects.findUnique({
      where: { id,
        client: {
          userId: userId
        }
       },
      select: {
        id: true,
        name: true,
        description: true,
        startDate: true,
        endDate: true,
        clientId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!project) {
      throw new HttpException(`Project with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }


    return project;

  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(`Error finding project with ID ${id}: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
