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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const car_entity_1 = require("../cars/entities/car.entity");
const user_entity_1 = require("../users/entities/user.entity");
let OrderService = class OrderService {
    orderRepository;
    carRepository;
    userRepository;
    constructor(orderRepository, carRepository, userRepository) {
        this.orderRepository = orderRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
    }
    async create(createOrderDto) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: createOrderDto.userId },
            });
            if (!user) {
                throw new common_1.NotFoundException('Foydalanuvchi topilmadi');
            }
            const car = await this.carRepository.findOne({
                where: { id: createOrderDto.carId },
            });
            if (!car) {
                throw new common_1.NotFoundException('Avtomobil topilmadi');
            }
            if (car.count < createOrderDto.count) {
                throw new common_1.BadRequestException(`Bu avtomobildan faqat ${car.count} ta mavjud`);
            }
            const start = new Date(createOrderDto.startDate);
            const end = new Date(createOrderDto.endDate);
            const farqMs = end.getTime() - start.getTime();
            if (farqMs < 0) {
                throw new common_1.BadRequestException('Sana Xato kiritilgan');
            }
            const kunFarqi = Math.ceil(farqMs / (1000 * 60 * 60 * 24));
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
            await this.carRepository.update(car.id, {
                count: car.count - createOrderDto.count,
            });
            return savedOrder;
        }
        catch (error) {
            throw error;
        }
    }
    async findAll() {
        try {
            return await this.orderRepository.find({
                relations: ['user', 'car'],
                order: { createdAt: 'DESC' },
            });
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        try {
            const order = await this.orderRepository.findOne({
                where: { id },
                relations: ['user', 'car'],
            });
            if (!order) {
                throw new common_1.NotFoundException(`Order with ID ${id} not found`);
            }
            return order;
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateOrderDto) {
        try {
            const order = await this.findOne(id);
            if (updateOrderDto.status === order_entity_1.OrderStatus.Completed &&
                order.status !== order_entity_1.OrderStatus.Completed) {
                await this.completeOrder(id);
                return await this.findOne(id);
            }
            if (updateOrderDto.status === order_entity_1.OrderStatus.Cancelled &&
                (order.status === order_entity_1.OrderStatus.Active ||
                    order.status === order_entity_1.OrderStatus.Pending)) {
                await this.carRepository.update(order.car.id, {
                    count: order.car.count + order.count,
                });
            }
            await this.orderRepository.update(id, updateOrderDto);
            return await this.findOne(id);
        }
        catch (error) {
            throw error;
        }
    }
    async remove(id) {
        try {
            const order = await this.findOne(id);
            if (order.status === order_entity_1.OrderStatus.Active ||
                order.status === order_entity_1.OrderStatus.Pending) {
                await this.carRepository.update(order.car.id, {
                    count: order.car.count + order.count,
                });
            }
            await this.orderRepository.delete({ id });
            return { message: 'Order successfully deleted' };
        }
        catch (error) {
            throw error;
        }
    }
    async completeOrder(id) {
        try {
            const order = await this.findOne(id);
            if (order.status === order_entity_1.OrderStatus.Completed) {
                throw new common_1.BadRequestException('Order allaqachon tugatilgan');
            }
            await this.orderRepository.update(id, { status: order_entity_1.OrderStatus.Completed });
            await this.carRepository.update(order.car.id, {
                count: order.car.count + order.count,
            });
            return { message: 'Order successfully completed' };
        }
        catch (error) {
            throw error;
        }
    }
    async findUserActiveOrders(userId) {
        try {
            return await this.orderRepository.find({
                where: {
                    user: { id: userId },
                    status: order_entity_1.OrderStatus.Active,
                },
                relations: ['car'],
                order: { createdAt: 'DESC' },
            });
        }
        catch (error) {
            throw error;
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(car_entity_1.Car)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrderService);
//# sourceMappingURL=order.service.js.map