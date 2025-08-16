import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car) private readonly carRepository: Repository<Car>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createCarDto: CreateCarDto, userId: number) {
    try {
      // Type bo'yicha kategoriya topish
      const category = await this.categoryService.findByType(createCarDto.type);

      // Agar kategoriya topilmasa, avtomatik yaratish
      if (!category) {
        throw new BadRequestException(
          `Category for type '${createCarDto.type}' not found `,
        );
      }

      // categoryId ni avtomatik olish
      createCarDto.categoryId = category.id;

      // userId ni qo'shish
      const car = this.carRepository.create({
        ...createCarDto,
        userId: userId,
      });

      const savedCar = await this.carRepository.save(car);
      return savedCar;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.carRepository.find({
        relations: ['category'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const car = await this.carRepository.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!car) {
        throw new NotFoundException(`Car with id: ${id} not found`);
      }
      return car;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateCarDto: UpdateCarDto, userId: number) {
    try {
      const car = await this.findOne(id);

      // User o'z mashinasini tahrirlayotganini tekshirish
      if (car.userId !== userId) {
        throw new BadRequestException(
          "O'z mashinangizni tahrirlashingiz mumkin",
        );
      }

      // Agar type o'zgartirilayotgan bo'lsa, yangi kategoriya topish
      if (updateCarDto.type && updateCarDto.type !== car.type) {
        let category = await this.categoryService.findByType(updateCarDto.type);

        // Agar kategoriya topilmasa, avtomatik yaratish
        if (!category) {
          try {
            category = await this.categoryService.create({
              name: updateCarDto.type,
              description: `${updateCarDto.type} avtomobillar`,
              isActive: true,
            });
          } catch (error) {
            throw new BadRequestException(
              `Category for type '${updateCarDto.type}' not found and could not be created`,
            );
          }
        }

        updateCarDto.categoryId = category.id;
      }

      // Agar count kamaytirilayotgan bo'lsa, mavjud orderlar bilan tekshirish
      if (updateCarDto.count !== undefined && updateCarDto.count < car.count) {
        const availableCount = car.count - updateCarDto.count;
        if (availableCount < 0) {
          throw new BadRequestException(
            'Count ni kamaytirish mumkin emas. Faol orderlar mavjud',
          );
        }
      }

      await this.carRepository.update(id, updateCarDto);
      const updatedCar = await this.findOne(id);
      return updatedCar;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number, userId: number) {
    try {
      const car = await this.findOne(id);

      // User o'z mashinasini o'chirishini tekshirish
      if (car.userId !== userId) {
        throw new BadRequestException(
          "O'z mashinangizni o'chirishingiz mumkin",
        );
      }

      await this.carRepository.delete({ id });
      return car;
    } catch (error) {
      throw error;
    }
  }

  // Car count ni kamaytirish (order yaratilganda)
  async decreaseCount(id: number, count: number) {
    try {
      const car = await this.findOne(id);

      if (car.count < count) {
        throw new BadRequestException(
          `Bu avtomobildan faqat ${car.count} ta mavjud`,
        );
      }

      await this.carRepository.update(id, {
        count: car.count - count,
      });

      return await this.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  // Car count ni qaytarish (order tugaganda yoki bekor qilinganda)
  async increaseCount(id: number, count: number) {
    try {
      const car = await this.findOne(id);

      await this.carRepository.update(id, {
        count: car.count + count,
      });

      return await this.findOne(id);
    } catch (error) {
      throw error;
    }
  }
}
