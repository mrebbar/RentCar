import { Type } from 'class-transformer';
import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { CarType } from '../entities/car.entity';

export class CreateCarDto {
  @IsEnum(CarType)
  type: CarType;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @Type(() => Number)
  @IsNumber()
  year: number;

  @IsString()
  color: string;

  @Type(() => Number)
  @IsNumber()
  count: number;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number; // Avtomatik olinadi, lekin DTO da ham bo'lishi kerak
}
