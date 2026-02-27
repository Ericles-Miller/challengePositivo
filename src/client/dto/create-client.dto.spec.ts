import { validate } from 'class-validator';
import { CreateClientDto } from './create-client.dto';

describe('Suite test Create-client.dto', () => {
  it.each([
    ['John Doe', 'john@example.com', '468.205.570-43'],
    ['Jane Smith', 'jane.smith@example.com', '718.520.420-87'],
    ['Bob Johnson', 'bob@test.com', '653.417.680-78'],
    ['a'.repeat(80), 'long@example.com', '435.647.420-18'],
    ['Maria Silva', 'maria@example.com.br', '735.127.050-30'],
  ])('should return a valid Dto', async (name: string, email: string, document: string) => {
    const createClientDto = new CreateClientDto();
    createClientDto.name = name;
    createClientDto.email = email;
    createClientDto.document = document;

    const errors = await validate(createClientDto);
    expect(errors.length).toBe(0);
  });

  it.each([
    ['John Doe', 'john@example.com', '12345678900'],
    ['John Doe', 'john@example.com', '11111111111'],
    ['John Doe', 'john@example.com', '123456789'],
    ['John Doe', 'john@example.com', '12345678901234'],
    ['John Doe', 'john@example.com', 'abc12345678'],
    ['John Doe', 'john@example.com', ''],
    ['John Doe', 'john@example.com', null],
    ['John Doe', 'john@example.com', undefined],
    ['John Doe', 'invalid-email', '12345678909'],
    ['John Doe', '', '12345678909'],
    ['John Doe', null, '12345678909'],
    ['John Doe', undefined, '12345678909'],
    ['', 'john@example.com', '12345678909'],
    [null, 'john@example.com', '12345678909'],
    [undefined, 'john@example.com', '12345678909'],
    ['a'.repeat(81), 'john@example.com', '12345678909'],
  ])('should return an invalid Dto', async (name: string, email: string, document: string) => {
    const createClientDto = new CreateClientDto();
    createClientDto.name = name;
    createClientDto.email = email;
    createClientDto.document = document;

    const errors = await validate(createClientDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
