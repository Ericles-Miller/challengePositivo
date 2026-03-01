import { CreateClientDto } from '../dto/create-client.dto';
import { Client } from '../entities/client.entity';

export interface IClientRepository {
  create(createClientDto: CreateClientDto): Promise<Client>;
  findByEmail(email: string): Promise<Client | null>;
  findByDocument(document: string): Promise<Client | null>;
  findById(id: string): Promise<Client | null>;
  findAll(page: number, limit: number): Promise<{ data: Client[]; total: number }>;
  update(id: string, updateData: Client): Promise<Client>;
}
