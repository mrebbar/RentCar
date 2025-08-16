import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
export declare class UsersService {
    private readonly userRepository;
    private readonly JwtService;
    private readonly logger;
    constructor(userRepository: Repository<User>, JwtService: JwtService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findOneByEmail(email: string): Promise<User | null>;
    update(id: number, updateUserDto: UpdateUserDto, req?: any): Promise<User>;
    remove(id: number): Promise<{
        deletedUser: User;
        deleteResult: import("typeorm").DeleteResult;
    } | null>;
}
