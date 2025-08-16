export declare class ProfileResponseDto {
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
    orderHistory: Array<{
        id: number;
        car: {
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
        status: string;
        totalPrice: number;
        createdAt: Date;
    }>;
    cars?: Array<{
        id: number;
        brand: string;
        model: string;
        year: number;
        color: string;
        count: number;
        price: number;
        averageRating: number;
        totalReviews: number;
    }>;
}
