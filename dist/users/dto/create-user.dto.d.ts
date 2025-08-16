export declare enum UserRole {
    Admin = "Admin",
    User = "User",
    Lessor = "Lessor"
}
export declare class CreateUserDto {
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    role?: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    DLN: string;
    isEmailVerified?: boolean;
}
