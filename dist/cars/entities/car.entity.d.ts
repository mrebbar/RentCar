import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
export declare enum CarType {
    Sedan = "Sedan",
    Hatchback = "Hatchback",
    SUV = "Suv",
    Coupe = "Coupe",
    Pickup = "Pickup",
    SportCar = "SportCar",
    ElectricCar = "ElectricCar",
    HybridCar = "HybridCar"
}
export declare class Car {
    id: number;
    type: CarType;
    brand: string;
    model: string;
    year: number;
    color: string;
    count: number;
    price: number;
    categoryId: number;
    userId: number;
    category: Category;
    user: User;
    createdAt: Date;
    averageRating: number;
    totalReviews: number;
}
