import { Car } from 'src/cars/entities/car.entity';
import { User } from 'src/users/entities/user.entity';
export declare class Review {
    id: number;
    user: User;
    car: Car;
    rating: number;
    comment: string;
    createdAt: Date;
}
