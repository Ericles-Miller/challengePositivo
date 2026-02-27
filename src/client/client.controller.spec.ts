import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientResponseDto } from './dto/client-response.dto';

describe('ClientController', () => {
  let controller: ClientController;
  let service: ClientService;
  const createClientDto = { name: 'John Doe', email: 'john@example.com', document: '12345678900' };
  const mockClient: ClientResponseDto = {
    _id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john@example.com',
    document: '12345678900',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        ClientService,
        {
          provide: ClientService,
          useValue: {
            create: jest.fn(),
            findClientById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ClientController>(ClientController);
    service = module.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('suite test create client', () => {
    it('should create a new client successfully', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockClient);

      const result = await controller.create(createClientDto);

      expect(service.create).toHaveBeenCalledWith(createClientDto);
      expect(result).toBeDefined();
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.document).toBe('12345678900');
    });

    it('should throw BadRequestException if email already exists', async () => {
      jest.spyOn(service, 'create').mockRejectedValue({ response: { message: 'Email already exists' } });

      await expect(controller.create(createClientDto)).rejects.toEqual({ response: { message: 'Email already exists' } });
      expect(service.create).toHaveBeenCalledWith(createClientDto);
    });

    it('should throw BadRequestException if document already exists', async () => {
      jest.spyOn(service, 'create').mockRejectedValue({ response: { message: 'Document already exists' } });

      await expect(controller.create(createClientDto)).rejects.toEqual({ response: { message: 'Document already exists' } });
      expect(service.create).toHaveBeenCalledWith(createClientDto);
    });

    it('should throw InternalServerErrorException for unexpected errors', async () => {
      jest.spyOn(service, 'create').mockRejectedValue({ response: { message: 'Internal error while creating client' } });

      await expect(controller.create(createClientDto)).rejects.toEqual({
        response: { message: 'Internal error while creating client' },
      });
      expect(service.create).toHaveBeenCalledWith(createClientDto);
    });
  });

  describe('suite test get client by id', () => {
    it('should get a client by id successfully', async () => {
      jest.spyOn(service, 'findClientById').mockResolvedValue(mockClient);

      const result = await controller.findById(mockClient._id);

      expect(service.findClientById).toHaveBeenCalledWith(mockClient._id);
      expect(result).toBeDefined();
      expect(result.name).toBe(mockClient.name);
      expect(result.email).toBe(mockClient.email);
      expect(result.document).toBe(mockClient.document);
    });

    it('should throw NotFoundException if client not found', async () => {
      jest.spyOn(service, 'findClientById').mockRejectedValue({ response: { message: 'Client not found' } });

      await expect(controller.findById(mockClient._id)).rejects.toEqual({ response: { message: 'Client not found' } });
      expect(service.findClientById).toHaveBeenCalledWith(mockClient._id);
    });

    it('should throw InternalServerErrorException for unexpected errors', async () => {
      jest
        .spyOn(service, 'findClientById')
        .mockRejectedValue({ response: { message: 'Internal error while retrieving client' } });

      await expect(controller.findById(mockClient._id)).rejects.toEqual({
        response: { message: 'Internal error while retrieving client' },
      });
      expect(service.findClientById).toHaveBeenCalledWith(mockClient._id);
    });
  });
});
