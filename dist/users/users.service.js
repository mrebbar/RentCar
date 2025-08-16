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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
let UsersService = UsersService_1 = class UsersService {
    userRepository;
    JwtService;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(userRepository, JwtService) {
        this.userRepository = userRepository;
        this.JwtService = JwtService;
    }
    async create(createUserDto) {
        try {
            this.logger.log(`Creating user with email: ${createUserDto.email}`);
            const user = this.userRepository.create(createUserDto);
            const result = await this.userRepository.save(user);
            this.logger.log(`User created successfully with ID: ${result.id}`);
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
            const result = await this.userRepository.find();
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
            const result = await this.userRepository.findOne({ where: { id } });
            if (!result) {
                throw new Error(`User with id: ${id} not found`);
            }
            this.logger.log(`Successfully fetched user with ID: ${id}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to fetch user with ID: ${id}`, error.stack);
            throw error;
        }
    }
    async findOneByEmail(email) {
        try {
            this.logger.log(`Fetching user by email: ${email}`);
            const result = await this.userRepository.findOne({ where: { email } });
            this.logger.log(`Successfully fetched user by email: ${email}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to fetch user by email: ${email}`, error.stack);
            throw error;
        }
    }
    async update(id, updateUserDto, req) {
        try {
            if (updateUserDto.role === 'Admin' ||
                updateUserDto.role === 'SuperAdmin') {
                try {
                    const authHeader = req.headers['authorization'];
                    if (!authHeader) {
                        throw new common_1.UnauthorizedException('Authorization header required');
                    }
                    const token = authHeader.split(' ')[1];
                    if (!token) {
                        throw new common_1.UnauthorizedException('Bearer token required');
                    }
                    const decoded = this.JwtService.verify(token);
                    if (decoded.role !== 'SuperAdmin') {
                        throw new common_1.UnauthorizedException('Only SuperAdmin can update Admin users');
                    }
                }
                catch (error) {
                    throw new Error('Siz SuperAdmin emassiz');
                }
            }
            this.logger.log(`Updating user with ID: ${id}`);
            await this.userRepository.update(id, updateUserDto);
            const result = await this.findOne(id);
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
            this.logger.log(`Removing user with ID: ${id}`);
            const userToRemove = await this.findOne(id);
            if (!userToRemove) {
                this.logger.warn(`User with ID: ${id} not found`);
                return null;
            }
            const result = await this.userRepository.delete({ id });
            this.logger.log(`Successfully removed user with ID: ${id}`);
            return { deletedUser: userToRemove, deleteResult: result };
        }
        catch (error) {
            this.logger.error(`Failed to remove user with ID: ${id}`, error.stack);
            throw error;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map