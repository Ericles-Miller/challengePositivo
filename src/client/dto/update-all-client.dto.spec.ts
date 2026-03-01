import { validate } from 'class-validator';
import { UpdateAllClientDto } from './update-all-client.dto';

describe('Suite test Update-all-client.dto', () => {
  it.each([
    ['John Doe', 'john@example.com', '468.205.570-43'],
    ['Jane Smith', 'jane.smith@example.com', '718.520.420-87'],
    ['Bob Johnson', 'bob@test.com', '653.417.680-78'],
    ['Maria Silva', 'maria@example.com.br', '735.127.050-30'],
  ])('should return a valid Dto', async (name: string, email: string, document: string) => {
    const updateAllClientDto = new UpdateAllClientDto();
    updateAllClientDto.name = name;
    updateAllClientDto.email = email;
    updateAllClientDto.document = document;

    const errors = await validate(updateAllClientDto);
    expect(errors.length).toBe(0);
  });

  it('should return a valid Dto with only name', async () => {
    const updateAllClientDto = new UpdateAllClientDto();
    updateAllClientDto.name = 'John Doe';

    const errors = await validate(updateAllClientDto);
    expect(errors.length).toBe(0);
  });

  it('should return a valid Dto with only email', async () => {
    const updateAllClientDto = new UpdateAllClientDto();
    updateAllClientDto.email = 'john@example.com';

    const errors = await validate(updateAllClientDto);
    expect(errors.length).toBe(0);
  });

  it('should return a valid Dto with only document', async () => {
    const updateAllClientDto = new UpdateAllClientDto();
    updateAllClientDto.document = '468.205.570-43';

    const errors = await validate(updateAllClientDto);
    expect(errors.length).toBe(0);
  });

  it('should return a valid Dto with no fields (all optional)', async () => {
    const updateAllClientDto = new UpdateAllClientDto();

    const errors = await validate(updateAllClientDto);
    expect(errors.length).toBe(0);
  });

  it.each([
    ['John Doe', 'invalid-email', '123.321.458-43'],
    ['John Doe', 'john@example.com', '12345678900'],
    ['John Doe', 'john@example.com', '11111111111'],
    ['a'.repeat(81), 'john@example.com', '123.321.456-78'],
  ])('should return an invalid Dto', async (name: string, email: string, document: string) => {
    const updateAllClientDto = new UpdateAllClientDto();
    updateAllClientDto.name = name;
    updateAllClientDto.email = email;
    updateAllClientDto.document = document;

    const errors = await validate(updateAllClientDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
