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
var UsersController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const SuperAdminOrAdmin_guard_1 = require("../guard/SuperAdminOrAdmin.guard");
const swagger_1 = require("@nestjs/swagger");
let UsersController = UsersController_1 = class UsersController {
    usersService;
    logger = new common_1.Logger(UsersController_1.name);
    constructor(usersService) {
        this.usersService = usersService;
    }
    async create(createUserDto) {
        try {
            this.logger.log(`Creating user with email: ${createUserDto.email}`);
            const result = await this.usersService.create(createUserDto);
            this.logger.log(`User created successfully with email: ${createUserDto.email}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to create user with email: ${createUserDto.email}`, error.stack);
            throw error;
        }
    }
    async findAll() {
        try {
            this.logger.log('Fetching all users');
            const result = await this.usersService.findAll();
            this.logger.log(`Successfully fetched ${result.length} users`);
            return result;
        }
        catch (error) {
            this.logger.error('Failed to fetch all users', error.stack);
            throw error;
        }
    }
    async findOne(id) {
        try {
            this.logger.log(`Fetching user with ID: ${id}`);
            const result = await this.usersService.findOne(+id);
            this.logger.log(`Successfully fetched user with ID: ${id}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to fetch user with ID: ${id}`, error.stack);
            throw error;
        }
    }
    async update(id, updateUserDto) {
        try {
            this.logger.log(`Updating user with ID: ${id}`);
            const result = await this.usersService.update(+id, updateUserDto);
            this.logger.log(`Successfully updated user with ID: ${id}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to update user with ID: ${id}`, error.stack);
            throw error;
        }
    }
    async remove(id) {
        try {
            this.logger.log(`Deleting user with ID: ${id}`);
            const result = await this.usersService.remove(+id);
            this.logger.log(`Successfully deleted user with ID: ${id}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to delete user with ID: ${id}`, error.stack);
            throw error;
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new user',
        description: 'Create a new user account. Requires Admin or SuperAdmin role.'
    }),
    (0, swagger_1.ApiBody)({
        type: create_user_dto_1.CreateUserDto,
        description: 'User creation data',
        examples: {
            admin: {
                summary: 'Admin User',
                value: {
                    username: 'admin_user',
                    password: 'StrongPassword123!',
                    email: 'admin@example.com',
                    phoneNumber: '+998901234569',
                    role: 'Admin',
                    firstName: 'Admin',
                    lastName: 'User',
                    birthDate: '1980-01-01',
                    DLN: 'DLN345678'
                }
            },
            regular: {
                summary: 'Regular User',
                value: {
                    username: 'regular_user',
                    password: 'StrongPassword123!',
                    email: 'user@example.com',
                    phoneNumber: '+998901234570',
                    role: 'User',
                    firstName: 'Regular',
                    lastName: 'User',
                    birthDate: '1995-01-01',
                    DLN: 'DLN901234'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User created successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                username: { type: 'string', example: 'admin_user' },
                email: { type: 'string', example: 'admin@example.com' },
                phoneNumber: { type: 'string', example: '+998901234569' },
                role: { type: 'string', example: 'Admin' },
                firstName: { type: 'string', example: 'Admin' },
                lastName: { type: 'string', example: 'User' },
                birthDate: { type: 'string', example: '1980-01-01' },
                DLN: { type: 'string', example: 'DLN345678' },
                isEmailVerified: { type: 'boolean', example: false },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error or user already exists' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(SuperAdminOrAdmin_guard_1.AdminOrSuperAdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get all users',
        description: 'Retrieve all users. Requires Admin or SuperAdmin role.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all users',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    username: { type: 'string', example: 'admin_user' },
                    email: { type: 'string', example: 'admin@example.com' },
                    phoneNumber: { type: 'string', example: '+998901234569' },
                    role: { type: 'string', example: 'Admin' },
                    firstName: { type: 'string', example: 'Admin' },
                    lastName: { type: 'string', example: 'User' },
                    birthDate: { type: 'string', example: '1980-01-01' },
                    DLN: { type: 'string', example: 'DLN345678' },
                    isEmailVerified: { type: 'boolean', example: true },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(SuperAdminOrAdmin_guard_1.AdminOrSuperAdminGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get user by ID',
        description: 'Retrieve a specific user by ID. Requires Admin or SuperAdmin role.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'User ID',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User details',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                username: { type: 'string', example: 'admin_user' },
                email: { type: 'string', example: 'admin@example.com' },
                phoneNumber: { type: 'string', example: '+998901234569' },
                role: { type: 'string', example: 'Admin' },
                firstName: { type: 'string', example: 'Admin' },
                lastName: { type: 'string', example: 'User' },
                birthDate: { type: 'string', example: '1980-01-01' },
                DLN: { type: 'string', example: 'DLN345678' },
                isEmailVerified: { type: 'boolean', example: true },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(SuperAdminOrAdmin_guard_1.AdminOrSuperAdminGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update user',
        description: 'Update user details. Requires Admin or SuperAdmin role.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'User ID to update',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiBody)({
        type: update_user_dto_1.UpdateUserDto,
        description: 'User update data',
        examples: {
            updateRole: {
                summary: 'Update Role',
                value: {
                    role: 'Lessor'
                }
            },
            updateProfile: {
                summary: 'Update Profile',
                value: {
                    firstName: 'Updated',
                    lastName: 'Name',
                    phoneNumber: '+998901234571'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User updated successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                username: { type: 'string', example: 'admin_user' },
                email: { type: 'string', example: 'admin@example.com' },
                phoneNumber: { type: 'string', example: '+998901234571' },
                role: { type: 'string', example: 'Lessor' },
                firstName: { type: 'string', example: 'Updated' },
                lastName: { type: 'string', example: 'Name' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(SuperAdminOrAdmin_guard_1.AdminOrSuperAdminGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete user',
        description: 'Delete a user. Requires Admin or SuperAdmin role.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'User ID to delete',
        example: 1,
        type: 'number'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User deleted successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                username: { type: 'string', example: 'admin_user' },
                email: { type: 'string', example: 'admin@example.com' },
                message: { type: 'string', example: 'User deleted successfully' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(SuperAdminOrAdmin_guard_1.AdminOrSuperAdminGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = UsersController_1 = __decorate([
    (0, swagger_1.ApiTags)('Users Management'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map