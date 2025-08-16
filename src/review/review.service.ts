import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { Car } from '../cars/entities/car.entity';
import { Order, OrderStatus } from '../order/entities/order.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: number) {
    // 1. User bu mashinani ijara qilganmi tekshirish
    const hasOrdered = await this.orderRepository.findOne({
      where: {
        user: { id: userId },
        car: { id: createReviewDto.carId },
        status: OrderStatus.Completed,
      },
    });

    if (!hasOrdered) {
      throw new BadRequestException(
        'Bu mashinani ijara qilmagansiz yoki order tugallanmagan',
      );
    }

    // 2. Oldin review yozganmi tekshirish
    const existingReview = await this.reviewRepository.findOne({
      where: {
        user: { id: userId },
        car: { id: createReviewDto.carId },
      },
    });

    if (existingReview) {
      throw new BadRequestException(
        'Bu mashina haqida allaqachon review yozgansiz',
      );
    }

    // 3. Review yaratish
    const review = this.reviewRepository.create({
      ...createReviewDto,
      user: { id: userId },
      car: { id: createReviewDto.carId },
    });

    const savedReview = await this.reviewRepository.save(review);

    // 4. Car rating yangilash
    await this.updateCarRating(createReviewDto.carId);

    return savedReview;
  }

  async findAll() {
    return this.reviewRepository.find({
      relations: ['user', 'car'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'car'],
    });

    if (!review) {
      throw new NotFoundException('Review topilmadi');
    }

    return review;
  }

  async findByCar(carId: number) {
    return this.reviewRepository.find({
      where: { car: { id: carId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, userId: number) {
    const review = await this.findOne(id);

    // User o'z reviewini tahrirlayotganini tekshirish
    if (review.user.id !== userId) {
      throw new ForbiddenException("O'z reviewingizni tahrirlashingiz mumkin");
    }

    // Review yangilash
    console.log(review, updateReviewDto);

    Object.assign(review, updateReviewDto);
    console.log(review);

    const updatedReview = await this.reviewRepository.save(review);

    // Car rating yangilash
    await this.updateCarRating(review.car.id);

    return updatedReview;
  }

  async remove(id: number, userId: number) {
    const review = await this.findOne(id);

    // User o'z reviewini o'chirishini tekshirish
    if (review.user.id !== userId) {
      throw new ForbiddenException("O'z reviewingizni o'chirishingiz mumkin");
    }

    const carId = review.car.id;

    // Review o'chirish
    await this.reviewRepository.remove(review);

    // Car rating yangilash
    await this.updateCarRating(carId);

    return { message: "Review o'chirildi" };
  }

  private async updateCarRating(carId: number) {
    // Car uchun barcha reviewlarni olish
    const reviews = await this.reviewRepository.find({
      where: { car: { id: carId } },
    });

    if (reviews.length === 0) {
      // Review yo'q bo'lsa rating 0
      await this.carRepository.update(carId, {
        averageRating: 0,
        totalReviews: 0,
      });
      return;
    }

    // O'rtacha rating hisoblash
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Car rating yangilash
    await this.carRepository.update(carId, {
      averageRating: Math.round(averageRating * 100) / 100, // 2 ta o'nlik
      totalReviews: reviews.length,
    });
  }
}
