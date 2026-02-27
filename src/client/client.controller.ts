import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientResponseDto } from './dto/client-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('client')
@ApiTags('Client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create new client', description: 'Endpoint to create a new client in the system' })
  @ApiResponse({ status: 201, description: 'Client created successfully', type: ClientResponseDto })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async create(@Body() createClientDto: CreateClientDto): Promise<ClientResponseDto> {
    return await this.clientService.create(createClientDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find client by id', description: 'Endpoint to find a client by its id' })
  @ApiResponse({ status: 200, description: 'Client found successfully', type: ClientResponseDto })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findById(@Param('id') id: string): Promise<ClientResponseDto> {
    return await this.clientService.findClientById(id);
  }
}
