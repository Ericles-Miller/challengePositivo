import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { IClientRepository } from './repository/client-repository.interface';
import { InternalServerErrorException } from '@nestjs/common';

describe('ClientService', () => {
  let service: ClientService;
  let clientRepositoryMock: IClientRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: 'IClientRepository',
          useValue: {
            findByEmail: jest.fn(),
            findByDocument: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    clientRepositoryMock = module.get<IClientRepository>('IClientRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(clientRepositoryMock).toBeDefined();
  });

  describe('suit tests for create method', () => {
    it('should create a new client successfully', async () => {
      const createClientDto = { name: 'John Doe', email: 'john@example.com', document: '12345678900' };
      const createdClient = {
        ...createClientDto,
        _id: '507f1f77bcf86cd799439011',
        createdAt: new Date(),
        updatedAt: null,
      };

      jest.spyOn(clientRepositoryMock, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(clientRepositoryMock, 'findByDocument').mockResolvedValue(null);
      jest.spyOn(clientRepositoryMock, 'create').mockResolvedValue(createdClient);

      const result = await service.create(createClientDto);
      expect(result).toEqual(createdClient);
      expect(clientRepositoryMock.findByEmail).toHaveBeenCalledWith(createClientDto.email);
      expect(clientRepositoryMock.findByDocument).toHaveBeenCalledWith(createClientDto.document);
      expect(clientRepositoryMock.create).toHaveBeenCalledWith(createClientDto);
    });

    it('should throw BadRequestException if email already exists', async () => {
      const createClientDto = { name: 'John Doe', email: 'john@example.com', document: '12345678900' };
      const existingClient = { ...createClientDto, _id: '507f1f77bcf86cd799439011', createdAt: new Date(), updatedAt: null };

      jest.spyOn(clientRepositoryMock, 'findByEmail').mockResolvedValue(existingClient);

      await expect(service.create(createClientDto)).rejects.toThrow('Email already exists');
      expect(clientRepositoryMock.findByEmail).toHaveBeenCalledWith(createClientDto.email);
      expect(clientRepositoryMock.findByDocument).not.toHaveBeenCalled();
      expect(clientRepositoryMock.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if document already exists', async () => {
      const createClientDto = { name: 'John Doe', email: 'john@example.com', document: '12345678900' };
      const existingClient = { ...createClientDto, _id: '507f1f77bcf86cd799439011', createdAt: new Date(), updatedAt: null };

      jest.spyOn(clientRepositoryMock, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(clientRepositoryMock, 'findByDocument').mockResolvedValue(existingClient);

      await expect(service.create(createClientDto)).rejects.toThrow('Document already exists');
      expect(clientRepositoryMock.findByEmail).toHaveBeenCalledWith(createClientDto.email);
      expect(clientRepositoryMock.findByDocument).toHaveBeenCalledWith(createClientDto.document);
      expect(clientRepositoryMock.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const createClientDto = { name: 'John Doe', email: 'john@example.com', document: '12345678900' };
      jest.spyOn(clientRepositoryMock, 'findByEmail').mockRejectedValue(new InternalServerErrorException());

      await expect(service.create(createClientDto)).rejects.toThrow('Internal error while creating client');
    });
  });
});
