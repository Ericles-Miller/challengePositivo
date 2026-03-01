import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import type { IClientRepository } from './repository/client-repository.interface';
import { ClientResponseDto } from './dto/client-response.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateAllClientDto } from './dto/update-all-client.dto';

@Injectable()
export class ClientService {
  constructor(@Inject('IClientRepository') private readonly clientRepository: IClientRepository) {}

  async create({ name, email, document }: CreateClientDto): Promise<ClientResponseDto> {
    try {
      const emailAlreadyExists = await this.clientRepository.findByEmail(email);
      if (emailAlreadyExists) throw new BadRequestException('Email already exists');

      const documentAlreadyExists = await this.clientRepository.findByDocument(document);
      if (documentAlreadyExists) throw new BadRequestException('Document already exists');

      return await this.clientRepository.create({ name, email, document });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Internal error while creating client');
    }
  }

  async findClientById(id: string): Promise<ClientResponseDto> {
    try {
      const client = await this.clientRepository.findById(id);
      if (!client) throw new NotFoundException('Client not found');

      return client;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Internal error while finding client by id');
    }
  }

  async findAllClients(page: number = 1, limit: number = 10) {
    try {
      const { data, total } = await this.clientRepository.findAll(page, limit);

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch {
      throw new InternalServerErrorException('Internal error while finding clients');
    }
  }

  async updateClient(id: string, updateData: UpdateClientDto): Promise<ClientResponseDto> {
    try {
      const client = await this.clientRepository.findById(id);
      if (!client) throw new NotFoundException('Client not found');

      client.name = updateData.name || client.name;
      client.updatedAt = new Date();

      return await this.clientRepository.update(id, client);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Internal error while updating client');
    }
  }

  async updateAllClient(id: string, { name, email, document }: UpdateAllClientDto): Promise<ClientResponseDto> {
    try {
      const client = await this.clientRepository.findById(id);
      if (!client) throw new NotFoundException('Client not found');

      if (!name || !email || !document) throw new BadRequestException('All fields must be provided');

      const clientAlreadyExistsWithEmail = await this.clientRepository.findByEmail(email);
      if (clientAlreadyExistsWithEmail && clientAlreadyExistsWithEmail._id !== id)
        throw new BadRequestException('Email already exists');

      const clientAlreadyExistsWithDocument = await this.clientRepository.findByDocument(document);
      if (clientAlreadyExistsWithDocument && clientAlreadyExistsWithDocument._id !== id)
        throw new BadRequestException('Document already exists');

      client.name = name;
      client.email = email;
      client.document = document;
      client.updatedAt = new Date();

      return await this.clientRepository.update(id, client);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Internal error while updating client');
    }
  }
}
