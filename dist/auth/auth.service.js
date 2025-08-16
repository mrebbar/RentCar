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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../users/entities/user.entity");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
const env_config_1 = require("../config/env.config");
let AuthService = AuthService_1 = class AuthService {
    userRepository;
    jwtService;
    configService;
    userService;
    mailerService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(userRepository, jwtService, configService, userService, mailerService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.userService = userService;
        this.mailerService = mailerService;
    }
    async register(createUserDto, req) {
        try {
            const { email, username, role } = createUserDto;
            try {
                if (role === 'Admin') {
                    const authHeader = req.headers['authorization'] || req.header('authorization');
                    if (!authHeader)
                        throw new common_1.UnauthorizedException('Authorization header required');
                    const token = authHeader.replace('Bearer ', '');
                    const decoded = this.jwtService.verify(token);
                    if (decoded.role !== 'SuperAdmin')
                        throw new common_1.UnauthorizedException('Siz superAdmin emassiz');
                }
            }
            catch (error) {
                throw new Error('Siz SuperAdmin emassiz');
            }
            this.logger.log(`Starting registration process for email: ${email}`);
            const eUser = await this.userService.findOneByEmail(email);
            if (eUser) {
                this.logger.warn(`Registration failed: Email already exists: ${email}`);
                throw new common_1.BadRequestException('User with this email already exists');
            }
            const existingUser = await this.userRepository.findOne({
                where: { username },
            });
            if (existingUser) {
                this.logger.warn(`Registration failed: Username already exists: ${username}`);
                throw new common_1.BadRequestException('Bu username allaqachon ishlatilgan');
            }
            const payload = {
                username: createUserDto.username,
                password: createUserDto.password,
                email: createUserDto.email,
                phoneNumber: createUserDto.phoneNumber,
                role: createUserDto.role || 'User',
                firstName: createUserDto.firstName,
                lastName: createUserDto.lastName,
                birthDate: createUserDto.birthDate,
                DLN: createUserDto.DLN,
            };
            const token = this.jwtService.sign(payload, { expiresIn: '24h' });
            this.logger.log(`JWT token created for email: ${email}`);
            try {
                await this.sendEmailVerification(email, username, token);
                this.logger.log(`Verification email sent successfully to: ${email}`);
            }
            catch (error) {
                this.logger.error(`Failed to send verification email to: ${email}`, error.stack);
                throw new common_1.InternalServerErrorException("Email yuborishda xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring");
            }
            this.logger.log(`Registration process completed successfully for email: ${email}`);
            return {
                message: 'Please check your email to verify your account',
                email,
            };
        }
        catch (error) {
            this.logger.error(`Registration process failed for email: ${createUserDto.email}`, error.stack);
            throw error;
        }
    }
    async verifyEmail(token) {
        try {
            this.logger.log('Starting email verification process');
            const payload = this.jwtService.verify(token);
            if (!payload) {
                this.logger.warn('Email verification failed: Invalid token');
                throw new common_1.BadRequestException('Invalid token');
            }
            this.logger.log(`Token verified successfully for email: ${payload.email}`);
            const hashedPassword = await bcrypt.hash(payload.password, 10);
            this.logger.log('Password hashed successfully');
            const user = await this.userService.create({
                ...payload,
                password: hashedPassword,
                isEmailVerified: true,
            });
            this.logger.log(`User created successfully with ID: ${user.id}`);
            const accessToken = this.jwtService.sign({
                id: user.id,
                email: user.email,
                role: user.role,
            });
            this.logger.log(`Access token created for user ID: ${user.id}`);
            return {
                message: 'Email verified successfully',
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                },
            };
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                this.logger.warn('Email verification failed: Token expired');
                throw new common_1.BadRequestException('Token has expired');
            }
            this.logger.error('Email verification process failed', error.stack);
            throw new common_1.BadRequestException('Invalid token');
        }
    }
    async login(email, password) {
        try {
            this.logger.log(`Login attempt for email: ${email}`);
            const user = await this.userRepository.findOne({ where: { email } });
            if (!user) {
                this.logger.warn(`Login failed: User not found for email: ${email}`);
                throw new common_1.UnauthorizedException("Noto'g'ri email yoki parol. USER");
            }
            if (!user.isEmailVerified) {
                this.logger.warn(`Login failed: Email not verified for: ${email}`);
                throw new common_1.UnauthorizedException('Avval emailni tasdiqlang');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                this.logger.warn(`Login failed: Invalid password for email: ${email}`);
                throw new common_1.UnauthorizedException("Noto'g'ri email yoki parol");
            }
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role,
            };
            const accessToken = this.jwtService.sign(payload);
            this.logger.log(`Login successful for user ID: ${user.id}`);
            return {
                access_token: accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                },
            };
        }
        catch (error) {
            this.logger.error(`Login process failed for email: ${email}`, error.stack);
            throw error;
        }
    }
    async sendEmailVerification(email, username, token) {
        const verificationUrl = `${env_config_1.envVariables.frontend.url}/auth/verify-email?token=${token}`;
        const htmlContent = `
            <h1>Email tasdiqlash</h1>
            <p>Salom <strong>${username}</strong>!</p>
            <p>Emailingizni tasdiqlash uchun quyidagi linkni bosing:</p>
            <a href="${verificationUrl}">Emailni tasdiqlash</a>
            <p>Bu link 24 soatdan keyin amal qilmaydi.</p>
        `;
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'RentCar - Email tasdiqlash',
                html: htmlContent,
            });
            this.logger.log(`✅ Email yuborildi: ${email}`);
        }
        catch (error) {
            this.logger.error(`❌ Email yuborish xatosi: ${email}`, error.stack);
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService,
        users_service_1.UsersService,
        mailer_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map