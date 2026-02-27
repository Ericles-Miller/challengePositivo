import { InjectModel } from '@nestjs/mongoose';
import { CreateClientDto } from '../dto/create-client.dto';
import { Client } from '../entities/client.entity';
import { IClientRepository } from './client-repository.interface';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientRepository implements IClientRepository {
  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}

  async findById(id: string): Promise<Client | null> {
    const client = await this.clientModel.findById(id).exec();
    return client ? client.toJSON() : null;
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const createdClient = new this.clientModel({ ...createClientDto, updatedAt: null });
    return (await createdClient.save()).toJSON();
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.clientModel.findOne({ email }).exec();
    return client ? client.toJSON() : null;
  }

  async findByDocument(document: string): Promise<Client | null> {
    const client = await this.clientModel.findOne({ document }).exec();
    return client ? client.toJSON() : null;
  }

  async findAll(page: number, limit: number): Promise<{ data: Client[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.clientModel.find().skip(skip).limit(limit).exec(),
      this.clientModel.countDocuments().exec(),
    ]);

    return {
      data: data.map((doc) => doc.toJSON()),
      total,
    };
  }
}
