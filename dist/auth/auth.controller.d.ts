import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto, req: any): Promise<{
        message: string;
        email: string;
    }>;
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            username: string;
            role: string;
        };
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
}
