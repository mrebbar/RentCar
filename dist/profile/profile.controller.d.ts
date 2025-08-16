import { ProfileService } from './profile.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getProfile(req: any): Promise<import("./dto/profileResponse.dto").ProfileResponseDto>;
    updateProfile(updateProfileDto: UpdateProfileDto, req: any): Promise<{
        message: string;
        user: {
            id: number;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            phoneNumber: string;
            birthDate: string;
            DLN: string;
            role: string;
            isEmailVerified: boolean;
            createdAt: Date;
        };
    }>;
    changePassword(changePasswordDto: ChangePasswordDto, req: any): Promise<{
        message: string;
    }>;
    getOrderHistory(req: any): Promise<{
        id: number;
        car: {
            id: number;
            brand: string;
            model: string;
            year: number;
            color: string;
            count: number;
            price: number;
            categoryId: number;
            createdAt: Date;
        };
        startDate: Date;
        endDate: Date;
        count: number;
        status: import("../order/entities/order.entity").OrderStatus;
        totalPrice: number;
        createdAt: Date;
    }[]>;
    getMyCars(req: any): Promise<{
        id: number;
        brand: string;
        model: string;
        year: number;
        color: string;
        count: number;
        price: number;
        averageRating: number;
        totalReviews: number;
    }[]>;
}
