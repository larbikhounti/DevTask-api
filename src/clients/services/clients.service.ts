import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayloadType } from 'src/auth/types/jwt-payload.type';



@Injectable()
export class ClientsService {

  constructor(
    private readonly prismaService: PrismaService
  ) {}

  create(createClientDto: CreateClientDto, request: Request) {
    try {
      const  { sub: userId } = request['user'] as JwtPayloadType; // Assuming user ID is stored in request.user
      return this.prismaService.clients.create({
        data: { ...createClientDto, userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          createdAt: true,
          updatedAt: true,
        },
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
