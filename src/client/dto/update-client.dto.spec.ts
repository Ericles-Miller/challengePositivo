import { validate } from 'class-validator';
import { UpdateClientDto } from './update-client.dto';

describe('Suite test Update-client.dto', () => {
  it.each([['John Doe'], ['Jane Smith'], ['Bob Johnson'], ['Maria Silva']])(
    'should return a valid Dto',
    async (name: string) => {
      const updateClientDto = new UpdateClientDto();
      updateClientDto.name = name;

      const errors = await validate(updateClientDto);
      expect(errors.length).toBe(0);
    },
  );

  it.each([[''], [null], [undefined]])('should return an invalid Dto', async (name: string) => {
    const updateClientDto = new UpdateClientDto();
    updateClientDto.name = name;

    const errors = await validate(updateClientDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate email property (omitted by OmitType)', async () => {
    const updateClientDto = new UpdateClientDto();
    updateClientDto.name = 'John Doe';
    (updateClientDto as any).email = 'john@example.com';

    const errors = await validate(updateClientDto);
    expect(errors.length).toBe(0);
  });

  it('should not validate document property (omitted by OmitType)', async () => {
    const updateClientDto = new UpdateClientDto();
    updateClientDto.name = 'John Doe';
    (updateClientDto as any).document = '12345678900';

    const errors = await validate(updateClientDto);
    expect(errors.length).toBe(0);
  });

  it('should not validate email and document even with invalid values', async () => {
    const updateClientDto = new UpdateClientDto();
    updateClientDto.name = 'John Doe';
    (updateClientDto as any).email = 'invalid-email';
    (updateClientDto as any).document = 'invalid-document';

    const errors = await validate(updateClientDto);
    expect(errors.length).toBe(0);
  });
});
