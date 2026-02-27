import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import type { IClientRepository } from './repository/client-repository.interface';
import { ClientResponseDto } from './dto/client-response.dto';

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
}
