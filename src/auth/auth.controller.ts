import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Logger,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { 
  ApiTags, 
  ApiBody, 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery 
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ 
    summary: 'User registration', 
    description: 'Register a new user account. Admin creation requires SuperAdmin token.' 
  })
  @ApiBody({ 
    type: CreateUserDto,
    description: 'User registration data',
    examples: {
      user: {
        summary: 'Regular User',
        value: {
          username: 'john_doe',
          password: 'StrongPassword123!',
          email: 'john@example.com',
          phoneNumber: '+998901234567',
          role: 'User',
          firstName: 'John',
          lastName: 'Doe',
          birthDate: '1990-01-01',
          DLN: 'DLN123456'
        }
      },
      lessor: {
        summary: 'Lessor User',
        value: {
          username: 'car_owner',
          password: 'StrongPassword123!',
          email: 'owner@example.com',
          phoneNumber: '+998901234568',
          role: 'Lessor',
          firstName: 'Car',
          lastName: 'Owner',
          birthDate: '1985-05-15',
          DLN: 'DLN789012'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Registration successful. Check email for verification.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Please check your email to verify your account' },
        email: { type: 'string', example: 'john@example.com' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error or user already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized - SuperAdmin token required for Admin creation' })
  @ApiBearerAuth()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Req() req:any) {
    return this.authService.register(createUserDto, req);
  }

  @ApiOperation({ 
    summary: 'User login', 
    description: 'Login with email and password to get access token' 
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { 
          type: 'string', 
          format: 'email',
          example: 'john@example.com',
          description: 'User email address'
        },
        password: { 
          type: 'string',
          example: 'StrongPassword123!',
          description: 'User password (min 8 characters)'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'john@example.com' },
            username: { type: 'string', example: 'john_doe' },
            role: { type: 'string', example: 'User' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid credentials or email not verified' })
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @ApiOperation({ 
    summary: 'Email verification', 
    description: 'Verify email address using token from registration email' 
  })
  @ApiQuery({ 
    name: 'token', 
    description: 'JWT token from verification email',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Email verified successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Email verified successfully' },
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'john@example.com' },
            username: { type: 'string', example: 'john_doe' },
            role: { type: 'string', example: 'User' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid or expired token' })
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return await this.authService.verifyEmail(token);
  }
}
