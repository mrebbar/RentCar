import { Car } from 'src/cars/entities/car.entity';
import { User } from 'src/users/entities/user.entity';
export declare enum OrderStatus {
    Active = "Active",
    Completed = "Completed",
    Cancelled = "Cancelled",
    Pending = "Pending"
}
export declare class Order {
    id: number;
    user: User;
    car: Car;
    startDate: Date;
    endDate: Date;
    status: OrderStatus;
    count: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}
