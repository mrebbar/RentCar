import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Car } from '../cars/entities/car.entity';
import { User } from '../users/entities/user.entity';
export declare class OrderService {
    private readonly orderRepository;
    private readonly carRepository;
    private readonly userRepository;
    constructor(orderRepository: Repository<Order>, carRepository: Repository<Car>, userRepository: Repository<User>);
    create(createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order>;
    remove(id: number): Promise<{
        message: string;
    }>;
    completeOrder(id: number): Promise<{
        message: string;
    }>;
    findUserActiveOrders(userId: number): Promise<Order[]>;
}
