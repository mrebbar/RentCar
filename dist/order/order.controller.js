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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const user_guard_1 = require("../guard/user.guard");
const adminLessorSuperAdmin_guard_1 = require("../guard/adminLessorSuperAdmin.guard");
const order_entity_1 = require("./entities/order.entity");
const jwt_1 = require("@nestjs/jwt");
const All_guard_1 = require("../guard/All.guard");
const swagger_1 = require("@nestjs/swagger");
let OrderController = class OrderController {
    orderService;
    jwtService;
    constructor(orderService, jwtService) {
        this.orderService = orderService;
        this.jwtService = jwtService;
    }
    async create(createOrderDto, req) {
        const token = req.headers['authorization']?.split(' ')[1];
        const data = this.jwtService.verify(token);
        createOrderDto.userId = data.sub;
        return await this.orderService.create(createOrderDto);
    }
    async findAll() {
        return await this.orderService.findAll();
    }
    async findMyOrders(req) {
        return await this.orderService.findUserActiveOrders(req.user.sub);
    }
    async findOne(id, req) {
        const order = await this.orderService.findOne(+id);
        if ((req.user.role === 'User' || req.user.role === 'Lessor') &&
            order.user.id !== req.user.sub) {
            throw new common_1.ForbiddenException("Siz faqat o'z orderlaringizni ko'ra olasiz");
        }
        return order;
    }
    async update(id, updateOrderDto, req) {
        const order = await this.orderService.findOne(+id);
        if ((req.user.role === 'User' || req.user.role === 'Lessor') &&
            order.user.id !== req.user.sub) {
            throw new common_1.ForbiddenException("Siz faqat o'z orderlaringizni o'zgartira olasiz");
        }
        if (req.user.role === 'User') {
            if (updateOrderDto.status &&
                updateOrderDto.status !== order_entity_1.OrderStatus.Cancelled) {
                throw new common_1.ForbiddenException('Siz faqat orderni bekor qilishingiz mumkin');
            }
            updateOrderDto.status = order_entity_1.OrderStatus.Cancelled;
        }
        return await this.orderService.update(+id, updateOrderDto);
    }
    async completeOrder(id, req) {
        const order = await this.orderService.findOne(+id);
        if (req.user.role === 'Lessor' && req.user.sub !== order.user.id) {
            throw new common_1.ForbiddenException("Siz faqat o'z orderlaringizni tugatishningiz mumkin");
        }
        return await this.orderService.completeOrder(+id);
    }
    async remove(id, req) {
        const order = await this.orderService.findOne(+id);
        if (req.user.role === 'User' && order.user.id !== req.user.sub) {
            throw new common_1.ForbiddenException("Siz faqat o'z orderlaringizni o'chira olasiz");
        }
        return await this.orderService.remove(+id);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new order',
        description: 'Create a new car rental order. Requires User role.'
    }),
    (0, swagger_1.ApiBody)({
        type: create_order_dto_1.CreateOrderDto,
        description: 'Order creation data',
        examples: {
            basic: {
                summary: 'Basic Order',
                value: {
                    carId: 1,
                    startDate: '2024-01-15',
                    endDate: '2024-01-20',
                    count: 1
                }
            },
            multiple: {
                summary: 'Multiple Cars Order',
                value: {
                    carId: 2,
                    startDate: '2024-02-01',
                    endDate: '2024-02-05',
                    count: 2
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Order created successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                carId: { type: 'number', example: 1 },
                userId: { type: 'number', example: 1 },
                startDate: { type: 'string', example: '2024-01-15' },
                endDate: { type: 'string', example: '2024-01-20' },
                count: { type: 'number', example: 1 },
                totalPrice: { type: 'number', example: 250.00 },
                status: { type: 'string', example: 'Pending' },
                createdAt: { type: 'string', format: 'date-time' },
                car: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        brand: { type: 'string', example: 'Toyota' },
                        model: { type: 'string', example: 'Camry' }
                    }
                },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        username: { type: 'string', example: 'john_doe' },
                        email: { type: 'string', example: 'john@example.com' }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error or insufficient car count' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Car not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get all orders',
        description: 'Retrieve all orders. Requires Admin, Lessor, or SuperAdmin role.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all orders',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    carId: { type: 'number', example: 1 },
                    userId: { type: 'number', example: 1 },
                    startDate: { type: 'string', example: '2024-01-15' },
                    endDate: { type: 'string', example: '2024-01-20' },
                    count: { type: 'number', example: 1 },
                    totalPrice: { type: 'number', example: 250.00 },
                    status: { type: 'string', example: 'Pending' },
                    car: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            brand: { type: 'string', example: 'Toyota' },
                            model: { type: 'string', example: 'Camry' }
                        }
                    },
                    user: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            username: { type: 'string', example: 'john_doe' },
                            email: { type: 'string', example: 'john@example.com' }
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(adminLessorSuperAdmin_guard_1.AdminLessorSuperAdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get my active orders',
        description: 'Retrieve current user\'s active orders. Requires User role.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of user\'s active orders',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    carId: { type: 'number', example: 1 },
                    startDate: { type: 'string', example: '2024-01-15' },
                    endDate: { type: 'string', example: '2024-01-20' },
                    count: { type: 'number', example: 1 },
                    totalPrice: { type: 'number', example: 250.00 },
                    status: { type: 'string', example: 'Pending' },
                    car: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            brand: { type: 'string', example: 'Toyota' },
                            model: { type: 'string', example: 'Camry' }
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('my-active-orders'),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findMyOrders", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get order by ID',
        description: 'Retrieve a specific order. Users can only see their own orders.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Order ID',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Order details',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                carId: { type: 'number', example: 1 },
                userId: { type: 'number', example: 1 },
                startDate: { type: 'string', example: '2024-01-15' },
                endDate: { type: 'string', example: '2024-01-20' },
                count: { type: 'number', example: 1 },
                totalPrice: { type: 'number', example: 250.00 },
                status: { type: 'string', example: 'Pending' },
                car: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        brand: { type: 'string', example: 'Toyota' },
                        model: { type: 'string', example: 'Camry' }
                    }
                },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        username: { type: 'string', example: 'john_doe' },
                        email: { type: 'string', example: 'john@example.com' }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - can only view own orders' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(All_guard_1.AllGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update order',
        description: 'Update order details. Users can only cancel their own orders.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Order ID to update',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiBody)({
        type: update_order_dto_1.UpdateOrderDto,
        description: 'Order update data',
        examples: {
            cancel: {
                summary: 'Cancel Order',
                value: {
                    status: 'Cancelled'
                }
            },
            updateStatus: {
                summary: 'Update Status (Admin/Lessor)',
                value: {
                    status: 'Completed'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Order updated successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                status: { type: 'string', example: 'Cancelled' },
                message: { type: 'string', example: 'Order updated successfully' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - can only update own orders' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(adminLessorSuperAdmin_guard_1.AdminLessorSuperAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Complete order',
        description: 'Mark order as completed. Requires Admin, Lessor, or SuperAdmin role.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Order ID to complete',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Order completed successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                status: { type: 'string', example: 'Completed' },
                message: { type: 'string', example: 'Order completed successfully' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id/complete'),
    (0, common_1.UseGuards)(adminLessorSuperAdmin_guard_1.AdminLessorSuperAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "completeOrder", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete order',
        description: 'Delete an order. Users can only delete their own orders.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Order ID to delete',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Order deleted successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                message: { type: 'string', example: 'Order deleted successfully' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - can only delete own orders' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(adminLessorSuperAdmin_guard_1.AdminLessorSuperAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "remove", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, common_1.Controller)('order'),
    __metadata("design:paramtypes", [order_service_1.OrderService,
        jwt_1.JwtService])
], OrderController);
//# sourceMappingURL=order.controller.js.map