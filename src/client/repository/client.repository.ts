import { InjectModel } from '@nestjs/mongoose';
import { CreateClientDto } from '../dto/create-client.dto';
import { Client } from '../entities/client.entity';
import { IClientRepository } from './client-repository.interface';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientRepository implements IClientRepository {
  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const createdClient = new this.clientModel({ ...createClientDto, updatedAt: null });
    return (await createdClient.save()).toJSON();
  }

  async findByEmail(email: string): Promise<Client | null> {
    const result = await this.clientModel.findOne({ email }).exec();
    return result ? result.toJSON() : null;
  }

  async findByDocument(document: string): Promise<Client | null> {
    const result = await this.clientModel.findOne({ document }).exec();
    return result ? result.toJSON() : null;
  }
}
