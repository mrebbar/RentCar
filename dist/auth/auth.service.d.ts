import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private userRepository;
    private jwtService;
    private configService;
    private userService;
    private mailerService;
    private readonly logger;
    constructor(userRepository: Repository<User>, jwtService: JwtService, configService: ConfigService, userService: UsersService, mailerService: MailerService);
    register(createUserDto: CreateUserDto, req?: any): Promise<{
        message: string;
        email: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: number;
            email: string;
            username: string;
            role: string;
        };
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            username: string;
            role: string;
        };
    }>;
    private sendEmailVerification;
}
