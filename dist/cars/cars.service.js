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
exports.CarsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const car_entity_1 = require("./entities/car.entity");
const typeorm_2 = require("typeorm");
const category_service_1 = require("../category/category.service");
let CarsService = class CarsService {
    carRepository;
    categoryService;
    constructor(carRepository, categoryService) {
        this.carRepository = carRepository;
        this.categoryService = categoryService;
    }
    async create(createCarDto, userId) {
        try {
            const category = await this.categoryService.findByType(createCarDto.type);
            if (!category) {
                throw new common_1.BadRequestException(`Category for type '${createCarDto.type}' not found `);
            }
            createCarDto.categoryId = category.id;
            const car = this.carRepository.create({
                ...createCarDto,
                userId: userId,
            });
            const savedCar = await this.carRepository.save(car);
            return savedCar;
        }
        catch (error) {
            throw error;
        }
    }
    async findAll() {
        try {
            return await this.carRepository.find({
                relations: ['category'],
                order: { createdAt: 'DESC' },
            });
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        try {
            const car = await this.carRepository.findOne({
                where: { id },
                relations: ['category'],
            });
            if (!car) {
                throw new common_1.NotFoundException(`Car with id: ${id} not found`);
            }
            return car;
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateCarDto, userId) {
        try {
            const car = await this.findOne(id);
            if (car.userId !== userId) {
                throw new common_1.BadRequestException("O'z mashinangizni tahrirlashingiz mumkin");
            }
            if (updateCarDto.type && updateCarDto.type !== car.type) {
                let category = await this.categoryService.findByType(updateCarDto.type);
                if (!category) {
                    try {
                        category = await this.categoryService.create({
                            name: updateCarDto.type,
                            description: `${updateCarDto.type} avtomobillar`,
                            isActive: true,
                        });
                    }
                    catch (error) {
                        throw new common_1.BadRequestException(`Category for type '${updateCarDto.type}' not found and could not be created`);
                    }
                }
                updateCarDto.categoryId = category.id;
            }
            if (updateCarDto.count !== undefined && updateCarDto.count < car.count) {
                const availableCount = car.count - updateCarDto.count;
                if (availableCount < 0) {
                    throw new common_1.BadRequestException('Count ni kamaytirish mumkin emas. Faol orderlar mavjud');
                }
            }
            await this.carRepository.update(id, updateCarDto);
            const updatedCar = await this.findOne(id);
            return updatedCar;
        }
        catch (error) {
            throw error;
        }
    }
    async remove(id, userId) {
        try {
            const car = await this.findOne(id);
            if (car.userId !== userId) {
                throw new common_1.BadRequestException("O'z mashinangizni o'chirishingiz mumkin");
            }
            await this.carRepository.delete({ id });
            return car;
        }
        catch (error) {
            throw error;
        }
    }
    async decreaseCount(id, count) {
        try {
            const car = await this.findOne(id);
            if (car.count < count) {
                throw new common_1.BadRequestException(`Bu avtomobildan faqat ${car.count} ta mavjud`);
            }
            await this.carRepository.update(id, {
                count: car.count - count,
            });
            return await this.findOne(id);
        }
        catch (error) {
            throw error;
        }
    }
    async increaseCount(id, count) {
        try {
            const car = await this.findOne(id);
            await this.carRepository.update(id, {
                count: car.count + count,
            });
            return await this.findOne(id);
        }
        catch (error) {
            throw error;
        }
    }
};
exports.CarsService = CarsService;
exports.CarsService = CarsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(car_entity_1.Car)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        category_service_1.CategoryService])
], CarsService);
//# sourceMappingURL=cars.service.js.map