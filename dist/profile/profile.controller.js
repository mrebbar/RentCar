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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const profile_service_1 = require("./profile.service");
const change_password_dto_1 = require("./dto/change-password.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const All_guard_1 = require("../guard/All.guard");
const swagger_1 = require("@nestjs/swagger");
let ProfileController = class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    async getProfile(req) {
        const userId = req.user.sub;
        return this.profileService.getProfile(userId);
    }
    async updateProfile(updateProfileDto, req) {
        const userId = req.user.sub;
        return this.profileService.updateProfile(userId, updateProfileDto);
    }
    async changePassword(changePasswordDto, req) {
        const userId = req.user.sub;
        return this.profileService.changePassword(userId, changePasswordDto);
    }
    async getOrderHistory(req) {
        const userId = req.user.sub;
        return this.profileService.getOrderHistory(userId);
    }
    async getMyCars(req) {
        const userId = req.user.sub;
        return this.profileService.getMyCars(userId);
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get user profile',
        description: 'Retrieve current user profile information'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User profile details',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                username: { type: 'string', example: 'john_doe' },
                email: { type: 'string', example: 'john@example.com' },
                phoneNumber: { type: 'string', example: '+998901234567' },
                role: { type: 'string', example: 'User' },
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' },
                birthDate: { type: 'string', example: '1990-01-01' },
                DLN: { type: 'string', example: 'DLN123456' },
                isEmailVerified: { type: 'boolean', example: true },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update user profile',
        description: 'Update current user profile information'
    }),
    (0, swagger_1.ApiBody)({
        type: update_profile_dto_1.UpdateProfileDto,
        description: 'Profile update data',
        examples: {
            basic: {
                summary: 'Update Basic Info',
                value: {
                    firstName: 'Updated',
                    lastName: 'Name',
                    phoneNumber: '+998901234571'
                }
            },
            full: {
                summary: 'Update Full Profile',
                value: {
                    firstName: 'John',
                    lastName: 'Smith',
                    phoneNumber: '+998901234572',
                    birthDate: '1995-05-15'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile updated successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                firstName: { type: 'string', example: 'Updated' },
                lastName: { type: 'string', example: 'Name' },
                phoneNumber: { type: 'string', example: '+998901234571' },
                message: { type: 'string', example: 'Profile updated successfully' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_profile_dto_1.UpdateProfileDto, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Change password',
        description: 'Change current user password'
    }),
    (0, swagger_1.ApiBody)({
        type: change_password_dto_1.ChangePasswordDto,
        description: 'Password change data',
        examples: {
            change: {
                summary: 'Change Password',
                value: {
                    currentPassword: 'OldPassword123!',
                    newPassword: 'NewPassword123!'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password changed successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Password changed successfully' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error or wrong current password' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('change-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_password_dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "changePassword", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get order history',
        description: 'Retrieve current user order history'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User order history',
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
                    status: { type: 'string', example: 'Completed' },
                    createdAt: { type: 'string', format: 'date-time' },
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
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getOrderHistory", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get my cars',
        description: 'Retrieve cars owned by current user (for Lessors)'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User\'s cars',
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
                    averageRating: { type: 'number', example: 4.5 },
                    totalReviews: { type: 'number', example: 10 },
                    category: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            name: { type: 'string', example: 'Sedan' }
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('cars'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getMyCars", null);
exports.ProfileController = ProfileController = __decorate([
    (0, swagger_1.ApiTags)('Profile'),
    (0, common_1.UseGuards)(All_guard_1.AllGuard),
    (0, common_1.Controller)('profile'),
    __metadata("design:paramtypes", [profile_service_1.ProfileService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map