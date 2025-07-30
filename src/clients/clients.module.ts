import { Module } from '@nestjs/common';
import { ClientsController } from './controllers/clients.controller';
import { ClientsService } from './services/clients.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  controllers: [ClientsController],
  providers: [ClientsService, PrismaService],
  
})
export class ClientsModule {}
