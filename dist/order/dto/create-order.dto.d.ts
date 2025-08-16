import { OrderStatus } from '../entities/order.entity';
export declare class CreateOrderDto {
    userId: number;
    carId: number;
    startDate: string;
    endDate: string;
    count: number;
    status?: OrderStatus;
}
