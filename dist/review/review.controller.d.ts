import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    create(createReviewDto: CreateReviewDto, req: any): Promise<import("./entities/review.entity").Review>;
    findAll(): Promise<import("./entities/review.entity").Review[]>;
    findOne(id: string): Promise<import("./entities/review.entity").Review>;
    findByCar(carId: string): Promise<import("./entities/review.entity").Review[]>;
    update(id: string, updateReviewDto: UpdateReviewDto, req: any): Promise<import("./entities/review.entity").Review>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
