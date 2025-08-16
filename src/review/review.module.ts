import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from 'src/cars/entities/car.entity';
import { Order } from 'src/order/entities/order.entity';
import { Review } from './entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Car, Order])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
