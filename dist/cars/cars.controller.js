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
exports.CarsController = void 0;
const common_1 = require("@nestjs/common");
const cars_service_1 = require("./cars.service");
const create_car_dto_1 = require("./dto/create-car.dto");
const update_car_dto_1 = require("./dto/update-car.dto");
const adminLessorSuperAdmin_guard_1 = require("../guard/adminLessorSuperAdmin.guard");
const swagger_1 = require("@nestjs/swagger");
let CarsController = class CarsController {
    carsService;
    constructor(carsService) {
        this.carsService = carsService;
    }
    async create(createCarDto, req) {
        const userId = req.user.sub;
        return await this.carsService.create(createCarDto, userId);
    }
    async findAll() {
        return await this.carsService.findAll();
    }
    async findOne(id) {
        return await this.carsService.findOne(+id);
    }
    async update(id, updateCarDto, req) {
        const userId = req.user.sub;
        return await this.carsService.update(+id, updateCarDto, userId);
    }
    async remove(id, req) {
        const userId = req.user.sub;
        return await this.carsService.remove(+id, userId);
    }
};
exports.CarsController = CarsController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new car',
        description: 'Create a new car listing. Requires Admin, Lessor, or SuperAdmin role.'
    }),
    (0, swagger_1.ApiBody)({
        type: create_car_dto_1.CreateCarDto,
        description: 'Car creation data',
        examples: {
            sedan: {
                summary: 'Sedan Car',
                value: {
                    type: 'Sedan',
                    brand: 'Toyota',
                    model: 'Camry',
                    year: 2022,
                    color: 'White',
                    count: 5,
                    price: 50.00
                }
            },
            suv: {
                summary: 'SUV Car',
                value: {
                    type: 'Suv',
                    brand: 'Honda',
                    model: 'CR-V',
                    year: 2023,
                    color: 'Black',
                    count: 3,
                    price: 75.00
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Car created successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                type: { type: 'string', example: 'Sedan' },
                brand: { type: 'string', example: 'Toyota' },
                model: { type: 'string', example: 'Camry' },
                year: { type: 'number', example: 2022 },
                color: { type: 'string', example: 'White' },
                count: { type: 'number', example: 5 },
                price: { type: 'number', example: 50.00 },
                categoryId: { type: 'number', example: 1 },
                userId: { type: 'number', example: 1 },
                createdAt: { type: 'string', format: 'date-time' },
                averageRating: { type: 'number', example: 4.5 },
                totalReviews: { type: 'number', example: 0 }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error or category not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(adminLessorSuperAdmin_guard_1.AdminLessorSuperAdminGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_car_dto_1.CreateCarDto, Object]),
    __metadata("design:returntype", Promise)
], CarsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get all cars',
        description: 'Retrieve all available cars with their categories'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all cars',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    type: { type: 'string', example: 'Sedan' },
                    brand: { type: 'string', example: 'Toyota' },
                    model: { type: 'string', example: 'Camry' },
                    year: { type: 'number', example: 2022 },
                    color: { type: 'string', example: 'White' },
                    count: { type: 'number', example: 5 },
                    price: { type: 'number', example: 50.00 },
                    category: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            name: { type: 'string', example: 'Sedan' },
                            description: { type: 'string', example: 'Sedan avtomobillar' }
                        }
                    }
                }
            }
        }
    }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CarsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get car by ID',
        description: 'Retrieve a specific car by its ID'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Car ID',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Car details',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                type: { type: 'string', example: 'Sedan' },
                brand: { type: 'string', example: 'Toyota' },
                model: { type: 'string', example: 'Camry' },
                year: { type: 'number', example: 2022 },
                color: { type: 'string', example: 'White' },
                count: { type: 'number', example: 5 },
                price: { type: 'number', example: 50.00 },
                category: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        name: { type: 'string', example: 'Sedan' },
                        description: { type: 'string', example: 'Sedan avtomobillar' }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Car not found' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CarsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update car',
        description: 'Update car details. Only the car owner can update their cars.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Car ID to update',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiBody)({
        type: update_car_dto_1.UpdateCarDto,
        description: 'Car update data',
        examples: {
            updatePrice: {
                summary: 'Update Price',
                value: {
                    price: 60.00
                }
            },
            updateCount: {
                summary: 'Update Count',
                value: {
                    count: 3
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Car updated successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                type: { type: 'string', example: 'Sedan' },
                brand: { type: 'string', example: 'Toyota' },
                model: { type: 'string', example: 'Camry' },
                year: { type: 'number', example: 2022 },
                color: { type: 'string', example: 'White' },
                count: { type: 'number', example: 3 },
                price: { type: 'number', example: 60.00 }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error or insufficient count' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - can only update own cars' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Car not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(adminLessorSuperAdmin_guard_1.AdminLessorSuperAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_car_dto_1.UpdateCarDto, Object]),
    __metadata("design:returntype", Promise)
], CarsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete car',
        description: 'Delete a car. Only the car owner can delete their cars.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Car ID to delete',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Car deleted successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                type: { type: 'string', example: 'Sedan' },
                brand: { type: 'string', example: 'Toyota' },
                model: { type: 'string', example: 'Camry' },
                message: { type: 'string', example: 'Car deleted successfully' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - can only delete own cars' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Car not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(adminLessorSuperAdmin_guard_1.AdminLessorSuperAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CarsController.prototype, "remove", null);
exports.CarsController = CarsController = __decorate([
    (0, swagger_1.ApiTags)('Cars'),
    (0, common_1.Controller)('cars'),
    __metadata("design:paramtypes", [cars_service_1.CarsService])
], CarsController);
//# sourceMappingURL=cars.controller.js.map