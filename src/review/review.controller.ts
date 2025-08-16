import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserGuard } from '../guard/user.guard';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam,
  ApiBody 
} from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({ 
    summary: 'Create a new review', 
    description: 'Create a new review for a car. Requires User role.' 
  })
  @ApiBody({ 
    type: CreateReviewDto,
    description: 'Review creation data',
    examples: {
      positive: {
        summary: 'Positive Review',
        value: {
          carId: 1,
          rating: 5,
          comment: 'Ajoyib avtomobil! Juda qulay va ishonchli.'
        }
      },
      neutral: {
        summary: 'Neutral Review',
        value: {
          carId: 2,
          rating: 3,
          comment: 'Yaxshi avtomobil, lekin narxi biroz yuqori.'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Review created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        carId: { type: 'number', example: 1 },
        userId: { type: 'number', example: 1 },
        rating: { type: 'number', example: 5 },
        comment: { type: 'string', example: 'Ajoyib avtomobil! Juda qulay va ishonchli.' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        car: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            brand: { type: 'string', example: 'Toyota' },
            model: { type: 'string', example: 'Camry' }
          }
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            username: { type: 'string', example: 'john_doe' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error or car not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(UserGuard)
  async create(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    const userId = req.user.sub;
    return this.reviewService.create(createReviewDto, userId);
  }

  @ApiOperation({ 
    summary: 'Get all reviews', 
    description: 'Retrieve all reviews with car and user information' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all reviews',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          carId: { type: 'number', example: 1 },
          userId: { type: 'number', example: 1 },
          rating: { type: 'number', example: 5 },
          comment: { type: 'string', example: 'Ajoyib avtomobil! Juda qulay va ishonchli.' },
          createdAt: { type: 'string', format: 'date-time' },
          car: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              brand: { type: 'string', example: 'Toyota' },
              model: { type: 'string', example: 'Camry' }
            }
          },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              username: { type: 'string', example: 'john_doe' },
              firstName: { type: 'string', example: 'John' },
              lastName: { type: 'string', example: 'Doe' }
            }
          }
        }
      }
    }
  })
  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @ApiOperation({ 
    summary: 'Get review by ID', 
    description: 'Retrieve a specific review by its ID' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Review ID',
    example: 1,
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Review details',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        carId: { type: 'number', example: 1 },
        userId: { type: 'number', example: 1 },
        rating: { type: 'number', example: 5 },
        comment: { type: 'string', example: 'Ajoyib avtomobil! Juda qulay va ishonchli.' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        car: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            brand: { type: 'string', example: 'Toyota' },
            model: { type: 'string', example: 'Camry' },
            year: { type: 'number', example: 2022 },
            color: { type: 'string', example: 'White' }
          }
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            username: { type: 'string', example: 'john_doe' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @ApiOperation({ 
    summary: 'Get reviews by car ID', 
    description: 'Retrieve all reviews for a specific car' 
  })
  @ApiParam({ 
    name: 'carId', 
    description: 'Car ID to get reviews for',
    example: 1,
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of reviews for the car',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          rating: { type: 'number', example: 5 },
          comment: { type: 'string', example: 'Ajoyib avtomobil! Juda qulay va ishonchli.' },
          createdAt: { type: 'string', format: 'date-time' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              username: { type: 'string', example: 'john_doe' },
              firstName: { type: 'string', example: 'John' },
              lastName: { type: 'string', example: 'Doe' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Car not found' })
  @Get('car/:carId')
  findByCar(@Param('carId') carId: string) {
    return this.reviewService.findByCar(+carId);
  }

  @ApiOperation({ 
    summary: 'Update review', 
    description: 'Update review details. Users can only update their own reviews.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Review ID to update',
    example: 1,
    type: 'number'
  })
  @ApiBody({ 
    type: UpdateReviewDto,
    description: 'Review update data',
    examples: {
      updateRating: {
        summary: 'Update Rating',
        value: {
          rating: 4
        }
      },
      updateComment: {
        summary: 'Update Comment',
        value: {
          comment: 'Yangi sharh matni'
        }
      },
      fullUpdate: {
        summary: 'Full Update',
        value: {
          rating: 5,
          comment: 'To\'liq yangilangan sharh'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Review updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        rating: { type: 'number', example: 4 },
        comment: { type: 'string', example: 'Yangi sharh matni' },
        message: { type: 'string', example: 'Review updated successfully' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only update own reviews' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(UserGuard)
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.reviewService.update(+id, updateReviewDto, userId);
  }

  @ApiOperation({ 
    summary: 'Delete review', 
    description: 'Delete a review. Users can only delete their own reviews.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Review ID to delete',
    example: 1,
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Review deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        message: { type: 'string', example: 'Review deleted successfully' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only delete own reviews' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(UserGuard)
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.reviewService.remove(+id, userId);
  }
}
