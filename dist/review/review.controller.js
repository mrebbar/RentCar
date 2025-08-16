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
exports.ReviewController = void 0;
const common_1 = require("@nestjs/common");
const review_service_1 = require("./review.service");
const create_review_dto_1 = require("./dto/create-review.dto");
const update_review_dto_1 = require("./dto/update-review.dto");
const user_guard_1 = require("../guard/user.guard");
const swagger_1 = require("@nestjs/swagger");
let ReviewController = class ReviewController {
    reviewService;
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    async create(createReviewDto, req) {
        const userId = req.user.sub;
        return this.reviewService.create(createReviewDto, userId);
    }
    findAll() {
        return this.reviewService.findAll();
    }
    findOne(id) {
        return this.reviewService.findOne(+id);
    }
    findByCar(carId) {
        return this.reviewService.findByCar(+carId);
    }
    async update(id, updateReviewDto, req) {
        const userId = req.user.sub;
        return this.reviewService.update(+id, updateReviewDto, userId);
    }
    async remove(id, req) {
        const userId = req.user.sub;
        return this.reviewService.remove(+id, userId);
    }
};
exports.ReviewController = ReviewController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new review',
        description: 'Create a new review for a car. Requires User role.'
    }),
    (0, swagger_1.ApiBody)({
        type: create_review_dto_1.CreateReviewDto,
        description: 'Review creation data',
        examples: {
            positive: {
                summary: 'Positive Review',
                value: {
                    carId: 1,
                    rating: 5,
                    comment: 'Ajoyib avtomobil! Juda qulay va ishonchli.'
                }
            },
            neutral: {
                summary: 'Neutral Review',
                value: {
                    carId: 2,
                    rating: 3,
                    comment: 'Yaxshi avtomobil, lekin narxi biroz yuqori.'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Review created successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                carId: { type: 'number', example: 1 },
                userId: { type: 'number', example: 1 },
                rating: { type: 'number', example: 5 },
                comment: { type: 'string', example: 'Ajoyib avtomobil! Juda qulay va ishonchli.' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
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
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error or car not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_review_dto_1.CreateReviewDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get all reviews',
        description: 'Retrieve all reviews with car and user information'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all reviews',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    carId: { type: 'number', example: 1 },
                    userId: { type: 'number', example: 1 },
                    rating: { type: 'number', example: 5 },
                    comment: { type: 'string', example: 'Ajoyib avtomobil! Juda qulay va ishonchli.' },
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
                            firstName: { type: 'string', example: 'John' },
                            lastName: { type: 'string', example: 'Doe' }
                        }
                    }
                }
            }
        }
    }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get review by ID',
        description: 'Retrieve a specific review by its ID'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Review ID',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Review details',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                carId: { type: 'number', example: 1 },
                userId: { type: 'number', example: 1 },
                rating: { type: 'number', example: 5 },
                comment: { type: 'string', example: 'Ajoyib avtomobil! Juda qulay va ishonchli.' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                car: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        brand: { type: 'string', example: 'Toyota' },
                        model: { type: 'string', example: 'Camry' },
                        year: { type: 'number', example: 2022 },
                        color: { type: 'string', example: 'White' }
                    }
                },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        username: { type: 'string', example: 'john_doe' },
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Review not found' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get reviews by car ID',
        description: 'Retrieve all reviews for a specific car'
    }),
    (0, swagger_1.ApiParam)({
        name: 'carId',
        description: 'Car ID to get reviews for',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of reviews for the car',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    rating: { type: 'number', example: 5 },
                    comment: { type: 'string', example: 'Ajoyib avtomobil! Juda qulay va ishonchli.' },
                    createdAt: { type: 'string', format: 'date-time' },
                    user: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            username: { type: 'string', example: 'john_doe' },
                            firstName: { type: 'string', example: 'John' },
                            lastName: { type: 'string', example: 'Doe' }
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Car not found' }),
    (0, common_1.Get)('car/:carId'),
    __param(0, (0, common_1.Param)('carId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "findByCar", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update review',
        description: 'Update review details. Users can only update their own reviews.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Review ID to update',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiBody)({
        type: update_review_dto_1.UpdateReviewDto,
        description: 'Review update data',
        examples: {
            updateRating: {
                summary: 'Update Rating',
                value: {
                    rating: 4
                }
            },
            updateComment: {
                summary: 'Update Comment',
                value: {
                    comment: 'Yangi sharh matni'
                }
            },
            fullUpdate: {
                summary: 'Full Update',
                value: {
                    rating: 5,
                    comment: 'To\'liq yangilangan sharh'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Review updated successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                rating: { type: 'number', example: 4 },
                comment: { type: 'string', example: 'Yangi sharh matni' },
                message: { type: 'string', example: 'Review updated successfully' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - can only update own reviews' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Review not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_review_dto_1.UpdateReviewDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete review',
        description: 'Delete a review. Users can only delete their own reviews.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Review ID to delete',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Review deleted successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                message: { type: 'string', example: 'Review deleted successfully' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - can only delete own reviews' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Review not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "remove", null);
exports.ReviewController = ReviewController = __decorate([
    (0, swagger_1.ApiTags)('Reviews'),
    (0, common_1.Controller)('review'),
    __metadata("design:paramtypes", [review_service_1.ReviewService])
], ReviewController);
//# sourceMappingURL=review.controller.js.map