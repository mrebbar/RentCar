import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
export declare class CarsService {
    private readonly carRepository;
    private readonly categoryService;
    constructor(carRepository: Repository<Car>, categoryService: CategoryService);
    create(createCarDto: CreateCarDto, userId: number): Promise<Car>;
    findAll(): Promise<Car[]>;
    findOne(id: number): Promise<Car>;
    update(id: number, updateCarDto: UpdateCarDto, userId: number): Promise<Car>;
    remove(id: number, userId: number): Promise<Car>;
    decreaseCount(id: number, count: number): Promise<Car>;
    increaseCount(id: number, count: number): Promise<Car>;
}
