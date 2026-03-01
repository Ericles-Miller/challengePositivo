import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { IClientRepository } from './repository/client-repository.interface';
import { InternalServerErrorException } from '@nestjs/common';
import { ClientResponseDto } from './dto/client-response.dto';
import { UpdateAllClientDto } from './dto/update-all-client.dto';

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
            update: jest.fn(),
            UpdateAllClientDto: jest.fn(),
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

  describe('suit tests for updateClient method', () => {
    it('should update a client successfully', async () => {
      const updateData = { name: 'John Updated' };
      const updatedClient = { ...mockCreatedClient, name: updateData.name, updatedAt: new Date() };

      jest.spyOn(clientRepositoryMock, 'findById').mockResolvedValue(mockCreatedClient);
      jest.spyOn(clientRepositoryMock, 'update').mockResolvedValue(updatedClient);

      const result = await service.updateClient(mockCreatedClient._id, updateData);
      expect(result).toEqual(updatedClient);
      expect(clientRepositoryMock.findById).toHaveBeenCalledWith(mockCreatedClient._id);
      expect(clientRepositoryMock.update).toHaveBeenCalledWith(mockCreatedClient._id, {
        ...mockCreatedClient,
        name: updateData.name,
        updatedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException if client not found', async () => {
      const updateData = { name: 'John Updated' };
      jest.spyOn(clientRepositoryMock, 'findById').mockResolvedValue(null);

      await expect(service.updateClient(mockCreatedClient._id, updateData)).rejects.toThrow('Client not found');
      expect(clientRepositoryMock.findById).toHaveBeenCalledWith(mockCreatedClient._id);
      expect(clientRepositoryMock.update).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const updateData = { name: 'John Updated' };
      jest.spyOn(clientRepositoryMock, 'findById').mockRejectedValue(new InternalServerErrorException());

      await expect(service.updateClient(mockCreatedClient._id, updateData)).rejects.toThrow(
        'Internal error while updating client',
      );
      expect(clientRepositoryMock.findById).toHaveBeenCalledWith(mockCreatedClient._id);
      expect(clientRepositoryMock.update).not.toHaveBeenCalled();
    });
  });

  describe('suit tests for updateAllClient method', () => {
    it('should update all client fields successfully', async () => {
      const updateData: UpdateAllClientDto = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        document: '98765432100',
      };
      const updatedClient = { ...mockCreatedClient, ...updateData, updatedAt: new Date() };

      jest.spyOn(clientRepositoryMock, 'findById').mockResolvedValue(mockCreatedClient);
      jest.spyOn(clientRepositoryMock, 'update').mockResolvedValue(updatedClient);

      const result = await service.updateAllClient(mockCreatedClient._id, updateData);
      expect(result).toEqual(updatedClient);
      expect(clientRepositoryMock.findById).toHaveBeenCalledWith(mockCreatedClient._id);
      expect(clientRepositoryMock.update).toHaveBeenCalledWith(mockCreatedClient._id, {
        ...mockCreatedClient,
        ...updateData,
        updatedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException if client not found', async () => {
      const updateData: UpdateAllClientDto = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        document: '98765432100',
      };
      jest.spyOn(clientRepositoryMock, 'findById').mockResolvedValue(null);

      await expect(service.updateAllClient(mockCreatedClient._id, updateData)).rejects.toThrow('Client not found');
      expect(clientRepositoryMock.findById).toHaveBeenCalledWith(mockCreatedClient._id);
      expect(clientRepositoryMock.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if any field is missing', async () => {
      const updateData: Partial<UpdateAllClientDto> = {
        name: 'John Updated',
        email: 'john.updated@example.com',
      };
      jest.spyOn(clientRepositoryMock, 'findById').mockResolvedValue(mockCreatedClient);

      await expect(service.updateAllClient(mockCreatedClient._id, updateData as UpdateAllClientDto)).rejects.toThrow(
        'All fields must be provided',
      );
      expect(clientRepositoryMock.findById).toHaveBeenCalledWith(mockCreatedClient._id);
      expect(clientRepositoryMock.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if document already exists', async () => {
      const updateData: UpdateAllClientDto = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        document: '98765432100',
      };
      jest.spyOn(clientRepositoryMock, 'findById').mockResolvedValue(mockCreatedClient);
      jest.spyOn(clientRepositoryMock, 'findByDocument').mockResolvedValue({ ...mockCreatedClient, _id: 'different-id' });

      await expect(service.updateAllClient(mockCreatedClient._id, updateData)).rejects.toThrow('Document already exists');
      expect(clientRepositoryMock.findById).toHaveBeenCalledWith(mockCreatedClient._id);
      expect(clientRepositoryMock.findByDocument).toHaveBeenCalledWith(updateData.document);
      expect(clientRepositoryMock.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if email already exists', async () => {
      const updateData: UpdateAllClientDto = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        document: '98765432100',
      };
      jest.spyOn(clientRepositoryMock, 'findById').mockResolvedValue(mockCreatedClient);
      jest.spyOn(clientRepositoryMock, 'findByEmail').mockResolvedValue({ ...mockCreatedClient, _id: 'different-id' });

      await expect(service.updateAllClient(mockCreatedClient._id, updateData)).rejects.toThrow('Email already exists');
      expect(clientRepositoryMock.findById).toHaveBeenCalledWith(mockCreatedClient._id);
      expect(clientRepositoryMock.findByEmail).toHaveBeenCalledWith(updateData.email);
      expect(clientRepositoryMock.update).not.toHaveBeenCalled();
    });

    it('should throw InternalServerError on unexpected error', async () => {
      const updateData: UpdateAllClientDto = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        document: '98765432100',
      };
      jest.spyOn(clientRepositoryMock, 'findById').mockRejectedValue(new Error('Unexpected error'));

      await expect(service.updateAllClient(mockCreatedClient._id, updateData)).rejects.toThrow(
        'Internal error while updating client',
      );
      expect(clientRepositoryMock.findById).toHaveBeenCalledWith(mockCreatedClient._id);
      expect(clientRepositoryMock.update).not.toHaveBeenCalled();
    });
  });
});
