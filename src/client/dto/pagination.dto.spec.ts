import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

describe('Suite test Pagination.dto', () => {
  it.each([
    [1, 10],
    [2, 20],
    [5, 50],
    [100, 100],
    [1, 1],
    [999, 999],
  ])('should return a valid Dto with page=%i and limit=%i', async (page: number, limit: number) => {
    const paginationDto = plainToInstance(PaginationDto, { page, limit });

    const errors = await validate(paginationDto);
    expect(errors.length).toBe(0);
    expect(paginationDto.page).toBe(page);
    expect(paginationDto.limit).toBe(limit);
  });

  it('should use default values when page and limit are not provided', async () => {
    const paginationDto = plainToInstance(PaginationDto, {});

    const errors = await validate(paginationDto);
    expect(errors.length).toBe(0);
    expect(paginationDto.page).toBe(1);
    expect(paginationDto.limit).toBe(10);
  });

  it.each([
    [0, 10],
    [-1, 10],
    [1, 0],
    [1, -5],
    [-1, -1],
    [1.5, 10],
    [1, 10.5],
    ['abc', 10],
    [1, 'xyz'],
  ])('should return an invalid Dto with page=%p and limit=%p', async (page: any, limit: any) => {
    const paginationDto = plainToInstance(PaginationDto, { page, limit });

    const errors = await validate(paginationDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should transform string numbers to integers', async () => {
    const paginationDto = plainToInstance(PaginationDto, { page: '5', limit: '20' });

    const errors = await validate(paginationDto);
    expect(errors.length).toBe(0);
    expect(paginationDto.page).toBe(5);
    expect(paginationDto.limit).toBe(20);
    expect(typeof paginationDto.page).toBe('number');
    expect(typeof paginationDto.limit).toBe('number');
  });
});
