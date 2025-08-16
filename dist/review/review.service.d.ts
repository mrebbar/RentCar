import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { Car } from '../cars/entities/car.entity';
import { Order } from '../order/entities/order.entity';
export declare class ReviewService {
    private reviewRepository;
    private carRepository;
    private orderRepository;
    constructor(reviewRepository: Repository<Review>, carRepository: Repository<Car>, orderRepository: Repository<Order>);
    create(createReviewDto: CreateReviewDto, userId: number): Promise<Review>;
    findAll(): Promise<Review[]>;
    findOne(id: number): Promise<Review>;
    findByCar(carId: number): Promise<Review[]>;
    update(id: number, updateReviewDto: UpdateReviewDto, userId: number): Promise<Review>;
    remove(id: number, userId: number): Promise<{
        message: string;
    }>;
    private updateCarRating;
}
