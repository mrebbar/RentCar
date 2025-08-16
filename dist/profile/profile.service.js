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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const order_entity_1 = require("../order/entities/order.entity");
const car_entity_1 = require("../cars/entities/car.entity");
const bcrypt = require("bcryptjs");
let ProfileService = class ProfileService {
    userRepository;
    orderRepository;
    carRepository;
    constructor(userRepository, orderRepository, carRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.carRepository = carRepository;
    }
    async getProfile(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User topilmadi');
        }
        const orderHistory = await this.orderRepository.find({
            where: { user: { id: userId } },
            relations: ['car'],
            order: { createdAt: 'DESC' },
        });
        let cars = [];
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
    async updateProfile(userId, updateProfileDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User topilmadi');
        }
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
    async changePassword(userId, changePasswordDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User topilmadi');
        }
        const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new common_1.BadRequestException("Joriy parol noto'g'ri");
        }
        if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
            throw new common_1.BadRequestException('Yangi parollar mos kelmayapti');
        }
        const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        user.password = hashedNewPassword;
        await this.userRepository.save(user);
        return { message: "Parol muvaffaqiyatli o'zgartirildi" };
    }
    async getOrderHistory(userId) {
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
    async getMyCars(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User topilmadi');
        }
        if (user.role !== 'Lessor') {
            throw new common_1.ForbiddenException('Bu funksiya faqat arendatorlar uchun');
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
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(car_entity_1.Car)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProfileService);
//# sourceMappingURL=profile.service.js.map