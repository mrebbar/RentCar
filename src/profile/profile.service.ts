import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profileResponse.dto';
import { User } from '../users/entities/user.entity';
import { Order } from '../order/entities/order.entity';
import { Car } from '../cars/entities/car.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
  ) {}

  async getProfile(userId: number): Promise<ProfileResponseDto> {
    // 1. User ma'lumotlarini olish
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User topilmadi');
    }

    // 2. Order history olish
    const orderHistory = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['car'],
      order: { createdAt: 'DESC' },
    });

    // 3. Cars olish (agar Lessor bo'lsa)
    let cars: any[] = [];
    if (user.role === 'Lessor') {
      cars = await this.carRepository.find({
        where: { userId: userId },
        order: { createdAt: 'DESC' },
      });
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        birthDate: user.birthDate,
        DLN: user.DLN,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
      orderHistory: orderHistory.map((order) => ({
        id: order.id,
        car: {
          id: order.car.id,
          brand: order.car.brand,
          model: order.car.model,
          year: order.car.year,
          color: order.car.color,
          count: order.car.count,
          price: order.car.price,
          categoryId: order.car.categoryId,
          createdAt: order.car.createdAt,
        },
        startDate: order.startDate,
        endDate: order.endDate,
        count: order.count,
        status: order.status,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
      })),
      cars: cars.map((car) => ({
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        color: car.color,
        count: car.count,
        price: car.price,
        averageRating: car.averageRating,
        totalReviews: car.totalReviews,
      })),
    };
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User topilmadi');
    }

    // Profil ma'lumotlarini yangilash
    Object.assign(user, updateProfileDto);

    const updatedUser = await this.userRepository.save(user);

    return {
      message: 'Profil yangilandi',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phoneNumber: updatedUser.phoneNumber,
        birthDate: updatedUser.birthDate,
        DLN: updatedUser.DLN,
        role: updatedUser.role,
        isEmailVerified: updatedUser.isEmailVerified,
        createdAt: updatedUser.createdAt,
      },
    };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User topilmadi');
    }

    // Joriy parolni tekshirish
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException("Joriy parol noto'g'ri");
    }

    // Yangi parolni tasdiqlash
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('Yangi parollar mos kelmayapti');
    }

    // Yangi parolni hash qilish
    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );

    // Parolni yangilash
    user.password = hashedNewPassword;
    await this.userRepository.save(user);

    return { message: "Parol muvaffaqiyatli o'zgartirildi" };
  }

  async getOrderHistory(userId: number) {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['car'],
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => ({
      id: order.id,
      car: {
        id: order.car.id,
        brand: order.car.brand,
        model: order.car.model,
        year: order.car.year,
        color: order.car.color,
        count: order.car.count,
        price: order.car.price,
        categoryId: order.car.categoryId,
        createdAt: order.car.createdAt,
      },
      startDate: order.startDate,
      endDate: order.endDate,
      count: order.count,
      status: order.status,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
    }));
  }

  async getMyCars(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User topilmadi');
    }

    if (user.role !== 'Lessor') {
      throw new ForbiddenException('Bu funksiya faqat arendatorlar uchun');
    }

    const cars = await this.carRepository.find({
      where: { userId: userId },
      order: { createdAt: 'DESC' },
    });

    return cars.map((car) => ({
      id: car.id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      color: car.color,
      count: car.count,
      price: car.price,
      averageRating: car.averageRating,
      totalReviews: car.totalReviews,
    }));
  }
}
