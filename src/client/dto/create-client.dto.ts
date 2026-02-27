import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsCPF } from '../validators/cpf.validator';

export class CreateClientDto {
  @ApiProperty({ example: 'John Doe', description: 'Client name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Client email' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '12345678900', description: 'Client CPF (only numbers)' })
  @IsString()
  @IsNotEmpty()
  @IsCPF({ message: 'Documento deve ser um CPF válido' })
  document: string;
}
