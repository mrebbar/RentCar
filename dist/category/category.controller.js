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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("./category.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const SuperAdminOrAdmin_guard_1 = require("../guard/SuperAdminOrAdmin.guard");
const swagger_1 = require("@nestjs/swagger");
let CategoryController = class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async create(createCategoryDto) {
        return await this.categoryService.create(createCategoryDto);
    }
    async findAll() {
        return await this.categoryService.findAll();
    }
    async findOne(id) {
        return await this.categoryService.findOne(+id);
    }
    async update(id, updateCategoryDto) {
        return await this.categoryService.update(+id, updateCategoryDto);
    }
    async remove(id) {
        return await this.categoryService.remove(+id);
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new category',
        description: 'Create a new car category. Requires Admin or SuperAdmin role.'
    }),
    (0, swagger_1.ApiBody)({
        type: create_category_dto_1.CreateCategoryDto,
        description: 'Category creation data',
        examples: {
            sedan: {
                summary: 'Sedan Category',
                value: {
                    name: 'Sedan',
                    description: 'Sedan avtomobillar - oddiy va qulay',
                    isActive: true
                }
            },
            suv: {
                summary: 'SUV Category',
                value: {
                    name: 'SUV',
                    description: 'SUV avtomobillar - katta va kuchli',
                    isActive: true
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Category created successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Sedan' },
                description: { type: 'string', example: 'Sedan avtomobillar - oddiy va qulay' },
                isActive: { type: 'boolean', example: true },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error or category already exists' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(SuperAdminOrAdmin_guard_1.AdminOrSuperAdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get all categories',
        description: 'Retrieve all available car categories'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all categories',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'Sedan' },
                    description: { type: 'string', example: 'Sedan avtomobillar - oddiy va qulay' },
                    isActive: { type: 'boolean', example: true },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    cars: {
                        type: 'array',
                        items: {
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
        }
    }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get category by ID',
        description: 'Retrieve a specific category by its ID'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Category ID',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category details',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Sedan' },
                description: { type: 'string', example: 'Sedan avtomobillar - oddiy va qulay' },
                isActive: { type: 'boolean', example: true },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                cars: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            brand: { type: 'string', example: 'Toyota' },
                            model: { type: 'string', example: 'Camry' },
                            year: { type: 'number', example: 2022 },
                            color: { type: 'string', example: 'White' },
                            price: { type: 'number', example: 50.00 }
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update category',
        description: 'Update category details. Requires Admin or SuperAdmin role.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Category ID to update',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiBody)({
        type: update_category_dto_1.UpdateCategoryDto,
        description: 'Category update data',
        examples: {
            updateName: {
                summary: 'Update Name',
                value: {
                    name: 'Updated Sedan'
                }
            },
            updateDescription: {
                summary: 'Update Description',
                value: {
                    description: 'Yangi sedan avtomobillar tavsifi'
                }
            },
            deactivate: {
                summary: 'Deactivate Category',
                value: {
                    isActive: false
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category updated successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Updated Sedan' },
                description: { type: 'string', example: 'Yangi sedan avtomobillar tavsifi' },
                isActive: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Category updated successfully' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(SuperAdminOrAdmin_guard_1.AdminOrSuperAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete category',
        description: 'Delete a category. Requires Admin or SuperAdmin role.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Category ID to delete',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category deleted successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Sedan' },
                message: { type: 'string', example: 'Category deleted successfully' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(SuperAdminOrAdmin_guard_1.AdminOrSuperAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "remove", null);
exports.CategoryController = CategoryController = __decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map