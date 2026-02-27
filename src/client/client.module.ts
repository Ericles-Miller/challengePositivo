import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client, ClientSchema } from './entities/client.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientRepository } from './repository/client.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }])],
  controllers: [ClientController],
  providers: [ClientService, { provide: 'IClientRepository', useClass: ClientRepository }],
})
export class ClientModule {}
