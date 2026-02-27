import { ApiProperty } from '@nestjs/swagger';

export class ClientResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Client ID' })
  _id: string;

  @ApiProperty({ example: 'John Doe', description: 'Client name' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Client email' })
  email: string;

  @ApiProperty({ example: '12345678900', description: 'Client CPF' })
  document: string;

  @ApiProperty({ example: '2026-02-27T10:00:00.000Z', description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-27T10:00:00.000Z', description: 'Last update date', required: false })
  updatedAt?: Date;
}
