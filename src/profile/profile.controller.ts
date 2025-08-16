import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AllGuard } from 'src/guard/All.guard';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiBody 
} from '@nestjs/swagger';

@ApiTags('Profile')
@UseGuards(AllGuard)
@Controller('profile') // Barcha endpointlar uchun JWT guard
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ 
    summary: 'Get user profile', 
    description: 'Retrieve current user profile information' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile details',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        username: { type: 'string', example: 'john_doe' },
        email: { type: 'string', example: 'john@example.com' },
        phoneNumber: { type: 'string', example: '+998901234567' },
        role: { type: 'string', example: 'User' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        birthDate: { type: 'string', example: '1990-01-01' },
        DLN: { type: 'string', example: 'DLN123456' },
        isEmailVerified: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiBearerAuth()
  @Get()
  async getProfile(@Req() req: any) {
    const userId = req.user.sub;

    return this.profileService.getProfile(userId);
  }

  @ApiOperation({ 
    summary: 'Update user profile', 
    description: 'Update current user profile information' 
  })
  @ApiBody({ 
    type: UpdateProfileDto,
    description: 'Profile update data',
    examples: {
      basic: {
        summary: 'Update Basic Info',
        value: {
          firstName: 'Updated',
          lastName: 'Name',
          phoneNumber: '+998901234571'
        }
      },
      full: {
        summary: 'Update Full Profile',
        value: {
          firstName: 'John',
          lastName: 'Smith',
          phoneNumber: '+998901234572',
          birthDate: '1995-05-15'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        firstName: { type: 'string', example: 'Updated' },
        lastName: { type: 'string', example: 'Name' },
        phoneNumber: { type: 'string', example: '+998901234571' },
        message: { type: 'string', example: 'Profile updated successfully' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiBearerAuth()
  @Patch()
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.profileService.updateProfile(userId, updateProfileDto);
  }

  @ApiOperation({ 
    summary: 'Change password', 
    description: 'Change current user password' 
  })
  @ApiBody({ 
    type: ChangePasswordDto,
    description: 'Password change data',
    examples: {
      change: {
        summary: 'Change Password',
        value: {
          currentPassword: 'OldPassword123!',
          newPassword: 'NewPassword123!'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password changed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password changed successfully' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error or wrong current password' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiBearerAuth()
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.profileService.changePassword(userId, changePasswordDto);
  }

  @ApiOperation({ 
    summary: 'Get order history', 
    description: 'Retrieve current user order history' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User order history',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          carId: { type: 'number', example: 1 },
          startDate: { type: 'string', example: '2024-01-15' },
          endDate: { type: 'string', example: '2024-01-20' },
          count: { type: 'number', example: 1 },
          totalPrice: { type: 'number', example: 250.00 },
          status: { type: 'string', example: 'Completed' },
          createdAt: { type: 'string', format: 'date-time' },
          car: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              brand: { type: 'string', example: 'Toyota' },
              model: { type: 'string', example: 'Camry' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiBearerAuth()
  @Get('orders')
  async getOrderHistory(@Req() req: any) {
    const userId = req.user.sub;
    return this.profileService.getOrderHistory(userId);
  }

  @ApiOperation({ 
    summary: 'Get my cars', 
    description: 'Retrieve cars owned by current user (for Lessors)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User\'s cars',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          type: { type: 'string', example: 'Sedan' },
          brand: { type: 'string', example: 'Toyota' },
          model: { type: 'string', example: 'Camry' },
          year: { type: 'number', example: 2022 },
          color: { type: 'string', example: 'White' },
          count: { type: 'number', example: 5 },
          price: { type: 'number', example: 50.00 },
          averageRating: { type: 'number', example: 4.5 },
          totalReviews: { type: 'number', example: 10 },
          category: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Sedan' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiBearerAuth()
  @Get('cars')
  async getMyCars(@Req() req: any) {
    const userId = req.user.sub;
    return this.profileService.getMyCars(userId);
  }
}
