import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminOrSuperAdminGuard } from '../guard/SuperAdminOrAdmin.guard';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam,
  ApiBody 
} from '@nestjs/swagger';

@ApiTags('Users Management')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ 
    summary: 'Create a new user', 
    description: 'Create a new user account. Requires Admin or SuperAdmin role.' 
  })
  @ApiBody({ 
    type: CreateUserDto,
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
  })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error or user already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AdminOrSuperAdminGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      this.logger.log(`Creating user with email: ${createUserDto.email}`);
      const result = await this.usersService.create(createUserDto);
      this.logger.log(
        `User created successfully with email: ${createUserDto.email}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to create user with email: ${createUserDto.email}`,
        error.stack,
      );
      throw error;
    }
  }

  @ApiOperation({ 
    summary: 'Get all users', 
    description: 'Retrieve all users. Requires Admin or SuperAdmin role.' 
  })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiBearerAuth()
  @UseGuards(AdminOrSuperAdminGuard)
  @Get()
  async findAll() {
    try {
      this.logger.log('Fetching all users');
      const result = await this.usersService.findAll();
      this.logger.log(`Successfully fetched ${result.length} users`);
      return result;
    } catch (error) {
      this.logger.error('Failed to fetch all users', error.stack);
      throw error;
    }
  }

  @ApiOperation({ 
    summary: 'Get user by ID', 
    description: 'Retrieve a specific user by ID. Requires Admin or SuperAdmin role.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'User ID',
    example: 1,
    type: 'number'
  })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @UseGuards(AdminOrSuperAdminGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      this.logger.log(`Fetching user with ID: ${id}`);
      const result = await this.usersService.findOne(+id);
      this.logger.log(`Successfully fetched user with ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch user with ID: ${id}`, error.stack);
      throw error;
    }
  }

  @ApiOperation({ 
    summary: 'Update user', 
    description: 'Update user details. Requires Admin or SuperAdmin role.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'User ID to update',
    example: 1,
    type: 'number'
  })
  @ApiBody({ 
    type: UpdateUserDto,
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
  })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @UseGuards(AdminOrSuperAdminGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      this.logger.log(`Updating user with ID: ${id}`);
      const result = await this.usersService.update(+id, updateUserDto);
      this.logger.log(`Successfully updated user with ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update user with ID: ${id}`, error.stack);
      throw error;
    }
  }

  @ApiOperation({ 
    summary: 'Delete user', 
    description: 'Delete a user. Requires Admin or SuperAdmin role.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'User ID to delete',
    example: 1,
    type: 'number'
  })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @UseGuards(AdminOrSuperAdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      this.logger.log(`Deleting user with ID: ${id}`);
      const result = await this.usersService.remove(+id);
      this.logger.log(`Successfully deleted user with ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete user with ID: ${id}`, error.stack);
      throw error;
    }
  }
}
