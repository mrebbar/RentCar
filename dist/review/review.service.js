"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("./entities/review.entity");
const car_entity_1 = require("../cars/entities/car.entity");
const order_entity_1 = require("../order/entities/order.entity");
let ReviewService = class ReviewService {
    reviewRepository;
    carRepository;
    orderRepository;
    constructor(reviewRepository, carRepository, orderRepository) {
        this.reviewRepository = reviewRepository;
        this.carRepository = carRepository;
        this.orderRepository = orderRepository;
    }
    async create(createReviewDto, userId) {
        const hasOrdered = await this.orderRepository.findOne({
            where: {
                user: { id: userId },
                car: { id: createReviewDto.carId },
                status: order_entity_1.OrderStatus.Completed,
            },
        });
        if (!hasOrdered) {
            throw new common_1.BadRequestException('Bu mashinani ijara qilmagansiz yoki order tugallanmagan');
        }
        const existingReview = await this.reviewRepository.findOne({
            where: {
                user: { id: userId },
                car: { id: createReviewDto.carId },
            },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('Bu mashina haqida allaqachon review yozgansiz');
        }
        const review = this.reviewRepository.create({
            ...createReviewDto,
            user: { id: userId },
            car: { id: createReviewDto.carId },
        });
        const savedReview = await this.reviewRepository.save(review);
        await this.updateCarRating(createReviewDto.carId);
        return savedReview;
    }
    async findAll() {
        return this.reviewRepository.find({
            relations: ['user', 'car'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const review = await this.reviewRepository.findOne({
            where: { id },
            relations: ['user', 'car'],
        });
        if (!review) {
            throw new common_1.NotFoundException('Review topilmadi');
        }
        return review;
    }
    async findByCar(carId) {
        return this.reviewRepository.find({
            where: { car: { id: carId } },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, updateReviewDto, userId) {
        const review = await this.findOne(id);
        if (review.user.id !== userId) {
            throw new common_1.ForbiddenException("O'z reviewingizni tahrirlashingiz mumkin");
        }
        console.log(review, updateReviewDto);
        Object.assign(review, updateReviewDto);
        console.log(review);
        const updatedReview = await this.reviewRepository.save(review);
        await this.updateCarRating(review.car.id);
        return updatedReview;
    }
    async remove(id, userId) {
        const review = await this.findOne(id);
        if (review.user.id !== userId) {
            throw new common_1.ForbiddenException("O'z reviewingizni o'chirishingiz mumkin");
        }
        const carId = review.car.id;
        await this.reviewRepository.remove(review);
        await this.updateCarRating(carId);
        return { message: "Review o'chirildi" };
    }
    async updateCarRating(carId) {
        const reviews = await this.reviewRepository.find({
            where: { car: { id: carId } },
        });
        if (reviews.length === 0) {
            await this.carRepository.update(carId, {
                averageRating: 0,
                totalReviews: 0,
            });
            return;
        }
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        await this.carRepository.update(carId, {
            averageRating: Math.round(averageRating * 100) / 100,
            totalReviews: reviews.length,
        });
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(car_entity_1.Car)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewService);
//# sourceMappingURL=review.service.js.map