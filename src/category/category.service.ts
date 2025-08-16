import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const conflictingCategory = await this.findByName(createCategoryDto.name);
      if (conflictingCategory) {
        throw new BadRequestException(
          `Category with name '${createCategoryDto.name}' already exists`,
        );
      }
      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.categoryRepository.find({
        where: { isActive: true },
        order: { name: 'ASC' },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['cars'],
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return category;
    } catch (error) {
      throw error;
    }
  }

  async findByName(name: string) {
    try {
      return await this.categoryRepository.findOne({
        where: { name },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.findOne(id);

      // Agar name o'zgartirilayotgan bo'lsa, boshqa kategoriya bilan bir xil bo'lmasligini tekshirish
      if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
        const existingCategory = await this.findByName(updateCategoryDto.name);
        if (existingCategory) {
          throw new BadRequestException(
            'Category with this name already exists',
          );
        }
      }

      await this.categoryRepository.update(id, updateCategoryDto);
      return await this.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const category = await this.findOne(id);

      // Agar kategoriyada avtomobillar bo'lsa, o'chirish mumkin emas
      if (category.cars && category.cars.length > 0) {
        throw new BadRequestException(
          'Cannot delete category with existing cars',
        );
      }

      await this.categoryRepository.delete({ id });
      return { message: 'Category successfully deleted' };
    } catch (error) {
      throw error;
    }
  }

  // Type bo'yicha kategoriya topish
  async findByType(type: string) {
    try {
      return await this.categoryRepository.findOne({
        where: { name: type },
      });
    } catch (error) {
      throw error;
    }
  }
}
