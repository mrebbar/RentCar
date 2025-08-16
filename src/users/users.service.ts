import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly JwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      this.logger.log(`Creating user with email: ${createUserDto.email}`);
      const user = this.userRepository.create(createUserDto);
      const result = await this.userRepository.save(user);
      this.logger.log(`User created successfully with ID: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to create user with email: ${createUserDto.email}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll() {
    try {
      this.logger.log('Fetching all users');
      const result = await this.userRepository.find();
      this.logger.log(`Successfully fetched ${result.length} users`);
      return result;
    } catch (error) {
      this.logger.error('Failed to fetch all users', error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      this.logger.log(`Fetching user with ID: ${id}`);
      const result = await this.userRepository.findOne({ where: { id } });
      if (!result) {
        throw new Error(`User with id: ${id} not found`);
      }
      this.logger.log(`Successfully fetched user with ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch user with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async findOneByEmail(email: string) {
    try {
      this.logger.log(`Fetching user by email: ${email}`);
      const result = await this.userRepository.findOne({ where: { email } });
      this.logger.log(`Successfully fetched user by email: ${email}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch user by email: ${email}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, req?: any) {
    try {
      if (
        updateUserDto.role === 'Admin' ||
        updateUserDto.role === 'SuperAdmin'
      ) {
        try {
          const authHeader = req.headers['authorization'];
          if (!authHeader) {
            throw new UnauthorizedException('Authorization header required');
          }
          const token = authHeader.split(' ')[1];
          if (!token) {
            throw new UnauthorizedException('Bearer token required');
          }
          const decoded = this.JwtService.verify(token);
          if (decoded.role !== 'SuperAdmin') {
            throw new UnauthorizedException(
              'Only SuperAdmin can update Admin users',
            );
          }
        } catch (error) {
          throw new Error('Siz SuperAdmin emassiz');
        }
      }

      this.logger.log(`Updating user with ID: ${id}`);
      await this.userRepository.update(id, updateUserDto);
      const result = await this.findOne(id);
      this.logger.log(`Successfully updated user with ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update user with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
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
    } catch (error) {
      this.logger.error(`Failed to remove user with ID: ${id}`, error.stack);
      throw error;
    }
  }
}
