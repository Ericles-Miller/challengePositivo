import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientRepository } from './client.repository';
import { Client } from '../entities/client.entity';
import { CreateClientDto } from '../dto/create-client.dto';

describe('ClientRepository', () => {
  let repository: ClientRepository;
  let model: Model<Client>;

  const mockClient = {
    _id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john@example.com',
    document: '12345678900',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockClientModel = {
    findById: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientRepository,
        {
          provide: getModelToken(Client.name),
          useValue: mockClientModel,
        },
      ],
    }).compile();

    repository = module.get<ClientRepository>(ClientRepository);
    model = module.get<Model<Client>>(getModelToken(Client.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should find a client by id', async () => {
      const mockExec = jest.fn().mockResolvedValue({
        toJSON: () => mockClient,
      });

      mockClientModel.findById.mockReturnValue({
        exec: mockExec,
      });

      const result = await repository.findById(mockClient._id);

      expect(mockClientModel.findById).toHaveBeenCalledWith(mockClient._id);
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(mockClient);
    });

    it('should return null when client is not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);

      mockClientModel.findById.mockReturnValue({
        exec: mockExec,
      });

      const result = await repository.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const createClientDto: CreateClientDto = {
        name: 'John Doe',
        email: 'john@example.com',
        document: '12345678900',
      };

      const mockSave = jest.fn().mockResolvedValue({
        toJSON: () => mockClient,
      });

      mockClientModel.save = mockSave;

      (model as any) = jest.fn().mockImplementation(() => ({
        save: mockSave,
      }));

      repository = new ClientRepository(model);

      const result = await repository.create(createClientDto);

      expect(result).toEqual(mockClient);
    });
  });

  describe('findByEmail', () => {
    it('should find a client by email', async () => {
      const mockExec = jest.fn().mockResolvedValue({
        toJSON: () => mockClient,
      });

      mockClientModel.findOne.mockReturnValue({
        exec: mockExec,
      });

      const result = await repository.findByEmail(mockClient.email);

      expect(mockClientModel.findOne).toHaveBeenCalledWith({ email: mockClient.email });
      expect(result).toEqual(mockClient);
    });

    it('should return null when client is not found by email', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);

      mockClientModel.findOne.mockReturnValue({
        exec: mockExec,
      });

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findByDocument', () => {
    it('should find a client by document', async () => {
      const mockExec = jest.fn().mockResolvedValue({
        toJSON: () => mockClient,
      });

      mockClientModel.findOne.mockReturnValue({
        exec: mockExec,
      });

      const result = await repository.findByDocument(mockClient.document);

      expect(mockClientModel.findOne).toHaveBeenCalledWith({ document: mockClient.document });
      expect(result).toEqual(mockClient);
    });

    it('should return null when client is not found by document', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);

      mockClientModel.findOne.mockReturnValue({
        exec: mockExec,
      });

      const result = await repository.findByDocument('00000000000');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return paginated clients', async () => {
      const mockClients = [
        { toJSON: () => mockClient },
        { toJSON: () => ({ ...mockClient, _id: '507f1f77bcf86cd799439012' }) },
      ];

      const mockFindExec = jest.fn().mockResolvedValue(mockClients);
      const mockCountExec = jest.fn().mockResolvedValue(10);

      mockClientModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: mockFindExec,
      });

      mockClientModel.countDocuments.mockReturnValue({
        exec: mockCountExec,
      });

      const result = await repository.findAll(1, 10);

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(10);
      expect(mockClientModel.find).toHaveBeenCalled();
      expect(mockClientModel.countDocuments).toHaveBeenCalled();
    });

    it('should handle pagination correctly', async () => {
      const page = 2;
      const limit = 5;
      const expectedSkip = (page - 1) * limit;

      const mockFindChain = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };

      mockClientModel.find.mockReturnValue(mockFindChain);
      mockClientModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      await repository.findAll(page, limit);

      expect(mockFindChain.skip).toHaveBeenCalledWith(expectedSkip);
      expect(mockFindChain.limit).toHaveBeenCalledWith(limit);
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const updatedClient = {
        ...mockClient,
        name: 'Jane Doe',
      };

      const mockExec = jest.fn().mockResolvedValue({ acknowledged: true });

      mockClientModel.updateOne.mockReturnValue({
        exec: mockExec,
      });

      const result = await repository.update(mockClient._id, updatedClient);

      expect(mockClientModel.updateOne).toHaveBeenCalledWith({ _id: mockClient._id }, updatedClient);
      expect(result).toEqual(updatedClient);
    });
  });

  describe('delete', () => {
    it('should delete a client', async () => {
      const mockExec = jest.fn().mockResolvedValue({ deletedCount: 1 });

      mockClientModel.deleteOne.mockReturnValue({
        exec: mockExec,
      });

      await repository.delete(mockClient._id);

      expect(mockClientModel.deleteOne).toHaveBeenCalledWith({ _id: mockClient._id });
      expect(mockExec).toHaveBeenCalled();
    });
  });
});
