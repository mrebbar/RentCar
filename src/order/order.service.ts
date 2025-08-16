import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { Car } from '../cars/entities/car.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Car) private readonly carRepository: Repository<Car>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      // User va Car mavjudligini tekshirish
      const user = await this.userRepository.findOne({
        where: { id: createOrderDto.userId },
      });
      if (!user) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      const car = await this.carRepository.findOne({
        where: { id: createOrderDto.carId },
      });
      if (!car) {
        throw new NotFoundException('Avtomobil topilmadi');
      }

      // Car count yetarli ekanligini tekshirish
      if (car.count < createOrderDto.count) {
        throw new BadRequestException(
          `Bu avtomobildan faqat ${car.count} ta mavjud`,
        );
      }

      //Necha kun mingani
      const start = new Date(createOrderDto.startDate);
      const end = new Date(createOrderDto.endDate);
      const farqMs = end.getTime() - start.getTime();
      if (farqMs < 0) {
        throw new BadRequestException('Sana Xato kiritilgan');
      }

      const kunFarqi = Math.ceil(farqMs / (1000 * 60 * 60 * 24));

      // Order yaratish
      const order = this.orderRepository.create({
        user,
        car,
        startDate: new Date(createOrderDto.startDate),
        endDate: new Date(createOrderDto.endDate),
        count: createOrderDto.count,
        status: createOrderDto.status,
        totalPrice: car.price * createOrderDto.count * kunFarqi,
      });

      const savedOrder = await this.orderRepository.save(order);

      // Car count ni kamaytirish
      await this.carRepository.update(car.id, {
        count: car.count - createOrderDto.count,
      });

      return savedOrder;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.orderRepository.find({
        relations: ['user', 'car'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['user', 'car'],
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      return order;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.findOne(id);

      // Agar status Completed ga o'zgartirilayotgan bo'lsa
      if (
        updateOrderDto.status === OrderStatus.Completed &&
        order.status !== OrderStatus.Completed
      ) {
        await this.completeOrder(id);
        return await this.findOne(id);
      }

      // Agar status Cancelled ga o'zgartirilayotgan bo'lsa va avval Active/Pending bo'lsa
      if (
        updateOrderDto.status === OrderStatus.Cancelled &&
        (order.status === OrderStatus.Active ||
          order.status === OrderStatus.Pending)
      ) {
        // Car count ni qaytarish
        await this.carRepository.update(order.car.id, {
          count: order.car.count + order.count,
        });
      }

      // Boshqa yangilanishlar
      await this.orderRepository.update(id, updateOrderDto);
      return await this.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const order = await this.findOne(id);

      // Agar order Active yoki Pending bo'lsa, car count ni qaytarish
      if (
        order.status === OrderStatus.Active ||
        order.status === OrderStatus.Pending
      ) {
        await this.carRepository.update(order.car.id, {
          count: order.car.count + order.count,
        });
      }

      await this.orderRepository.delete({ id });

      return { message: 'Order successfully deleted' };
    } catch (error) {
      throw error;
    }
  }

  // Order ni tugatish va car count ni qaytarish
  async completeOrder(id: number) {
    try {
      const order = await this.findOne(id);

      if (order.status === OrderStatus.Completed) {
        throw new BadRequestException('Order allaqachon tugatilgan');
      }

      // Order status ni Completed ga o'zgartirish
      await this.orderRepository.update(id, { status: OrderStatus.Completed });

      // Car count ni qaytarish (order tugagandan keyin)
      await this.carRepository.update(order.car.id, {
        count: order.car.count + order.count,
      });

      return { message: 'Order successfully completed' };
    } catch (error) {
      throw error;
    }
  }

  // User ning activeorderlarini olish
  async findUserActiveOrders(userId: number) {
    try {
      return await this.orderRepository.find({
        where: {
          user: { id: userId },
          status: OrderStatus.Active,
        },
        relations: ['car'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw error;
    }
  }
}
