import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { IClientRepository } from './repository/client-repository.interface';
import { InternalServerErrorException } from '@nestjs/common';
import { ClientResponseDto } from './dto/client-response.dto';

describe('ClientService', () => {
  let service: ClientService;
  let clientRepositoryMock: IClientRepository;
  const createClientDto = { name: 'John Doe', email: 'john@example.com', document: '12345678900' };

  const mockCreatedClient: ClientResponseDto = {
    ...createClientDto,
    _id: '507f1f77bcf86cd799439011',
    createdAt: new Date(),
    updatedAt: null,
  };

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
            findById: jest.fn(),
            findAll: jest.fn(),
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
      jest.spyOn(clientRepositoryMock, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(clientRepositoryMock, 'findByDocument').mockResolvedValue(null);
      jest.spyOn(clientRepositoryMock, 'create').mockResolvedValue(mockCreatedClient);

      const result = await service.create(createClientDto);
      expect(result).toEqual(mockCreatedClient);
      expect(clientRepositoryMock.findByEmail).toHaveBeenCalledWith(createClientDto.email);
      expect(clientRepositoryMock.findByDocument).toHaveBeenCalledWith(createClientDto.document);
      expect(clientRepositoryMock.create).toHaveBeenCalledWith(createClientDto);
    });

    it('should throw BadRequestException if email already exists', async () => {
      jest.spyOn(clientRepositoryMock, 'findByEmail').mockResolvedValue(mockCreatedClient);

      await expect(service.create(createClientDto)).rejects.toThrow('Email already exists');
      expect(clientRepositoryMock.findByEmail).toHaveBeenCalledWith(createClientDto.email);
      expect(clientRepositoryMock.findByDocument).not.toHaveBeenCalled();
      expect(clientRepositoryMock.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if document already exists', async () => {
      jest.spyOn(clientRepositoryMock, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(clientRepositoryMock, 'findByDocument').mockResolvedValue(mockCreatedClient);

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

  describe('suit tests for findClientById method', () => {
    it('should find a client by id successfully', async () => {
      jest.spyOn(clientRepositoryMock, 'findById').mockResolvedValue(mockCreatedClient);

      const result = await service.findClientById(mockCreatedClient._id);
      expect(result).toEqual(mockCreatedClient);
      expect(clientRepositoryMock.findById).toHaveBeenCalledWith(mockCreatedClient._id);
    });

    it('should throw NotFoundException if client not found', async () => {
      jest.spyOn(clientRepositoryMock, 'findById').mockResolvedValue(null);

      await expect(service.findClientById(mockCreatedClient._id)).rejects.toThrow('Client not found');
      expect(clientRepositoryMock.findById).toHaveBeenCalledWith(mockCreatedClient._id);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(clientRepositoryMock, 'findById').mockRejectedValue(new InternalServerErrorException());

      await expect(service.findClientById(mockCreatedClient._id)).rejects.toThrow(
        'Internal error while finding client by id',
      );
      expect(clientRepositoryMock.findById).toHaveBeenCalledWith(mockCreatedClient._id);
    });
  });

  describe('suit tests for findAllClients method', () => {
    it('should find all clients with pagination successfully', async () => {
      jest.spyOn(clientRepositoryMock, 'findAll').mockResolvedValue({ data: [mockCreatedClient], total: 1 });

      const result = await service.findAllClients(1, 10);
      expect(result).toEqual({
        data: [mockCreatedClient],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(clientRepositoryMock.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(clientRepositoryMock, 'findAll').mockRejectedValue(new InternalServerErrorException());

      await expect(service.findAllClients(1, 10)).rejects.toThrow('Internal error while finding clients');
      expect(clientRepositoryMock.findAll).toHaveBeenCalledWith(1, 10);
    });
  });
});
