import { Car } from 'src/cars/entities/car.entity';
export declare class Category {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    cars: Car[];
}
