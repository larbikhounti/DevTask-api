import { HttpException, HttpStatus, Injectable, Request } from '@nestjs/common';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';



@Injectable()
export class ClientsService {

  constructor(
    private readonly prismaService: PrismaService
  ) {}

  create(createClientDto: CreateClientDto, request: Request) {
    try {
      const userId = request['user'].id; // Assuming user ID is stored in request.user
      return this.prismaService.clients.create({
        data: { ...createClientDto, userId },
      });
    } catch (error) {
      // Handle error
      throw new HttpException(`Failed to create client`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all clients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
