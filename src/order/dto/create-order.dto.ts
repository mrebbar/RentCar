import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  carId: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
