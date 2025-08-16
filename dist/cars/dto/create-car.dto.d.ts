import { CarType } from '../entities/car.entity';
export declare class CreateCarDto {
    type: CarType;
    brand: string;
    model: string;
    year: number;
    color: string;
    count: number;
    price: number;
    categoryId?: number;
}
