import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { AdminLessorSuperAdminGuard } from 'src/guard/adminLessorSuperAdmin.guard';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam,
  ApiBody 
} from '@nestjs/swagger';

@ApiTags('Cars')
@Controller('cars')
export class CarsController {

  constructor(private readonly carsService: CarsService) {}

  @ApiOperation({ 
    summary: 'Create a new car', 
    description: 'Create a new car listing. Requires Admin, Lessor, or SuperAdmin role.' 
  })
  @ApiBody({ 
    type: CreateCarDto,
    description: 'Car creation data',
    examples: {
      sedan: {
        summary: 'Sedan Car',
        value: {
          type: 'Sedan',
          brand: 'Toyota',
          model: 'Camry',
          year: 2022,
          color: 'White',
          count: 5,
          price: 50.00
        }
      },
      suv: {
        summary: 'SUV Car',
        value: {
          type: 'Suv',
          brand: 'Honda',
          model: 'CR-V',
          year: 2023,
          color: 'Black',
          count: 3,
          price: 75.00
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Car created successfully',
    schema: {
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
        categoryId: { type: 'number', example: 1 },
        userId: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time' },
        averageRating: { type: 'number', example: 4.5 },
        totalReviews: { type: 'number', example: 0 }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error or category not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiBearerAuth()
  @UseGuards(AdminLessorSuperAdminGuard)
  @Post()
  async create(
    @Body() createCarDto: CreateCarDto,
    @Req() req: any
  ) {  
    const userId = req.user.sub;
    
    return await this.carsService.create(createCarDto, userId);
  }

  @ApiOperation({ 
    summary: 'Get all cars', 
    description: 'Retrieve all available cars with their categories' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all cars',
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
          category: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Sedan' },
              description: { type: 'string', example: 'Sedan avtomobillar' }
            }
          }
        }
      }
    }
  })
  @Get()
  async findAll() {
    return await this.carsService.findAll();
  }

  @ApiOperation({ 
    summary: 'Get car by ID', 
    description: 'Retrieve a specific car by its ID' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Car ID',
    example: 1,
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Car details',
    schema: {
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
        category: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Sedan' },
            description: { type: 'string', example: 'Sedan avtomobillar' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Car not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.carsService.findOne(+id);
  }

  @ApiOperation({ 
    summary: 'Update car', 
    description: 'Update car details. Only the car owner can update their cars.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Car ID to update',
    example: 1,
    type: 'number'
  })
  @ApiBody({ 
    type: UpdateCarDto,
    description: 'Car update data',
    examples: {
      updatePrice: {
        summary: 'Update Price',
        value: {
          price: 60.00
        }
      },
      updateCount: {
        summary: 'Update Count',
        value: {
          count: 3
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Car updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        type: { type: 'string', example: 'Sedan' },
        brand: { type: 'string', example: 'Toyota' },
        model: { type: 'string', example: 'Camry' },
        year: { type: 'number', example: 2022 },
        color: { type: 'string', example: 'White' },
        count: { type: 'number', example: 3 },
        price: { type: 'number', example: 60.00 }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error or insufficient count' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only update own cars' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AdminLessorSuperAdminGuard)
  async update(
    @Param('id') id: string, 
    @Body() updateCarDto: UpdateCarDto,
    @Req() req: any
  ) {
    const userId = req.user.sub;
    return await this.carsService.update(+id, updateCarDto, userId);
  }

  @ApiOperation({ 
    summary: 'Delete car', 
    description: 'Delete a car. Only the car owner can delete their cars.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Car ID to delete',
    example: 1,
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Car deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        type: { type: 'string', example: 'Sedan' },
        brand: { type: 'string', example: 'Toyota' },
        model: { type: 'string', example: 'Camry' },
        message: { type: 'string', example: 'Car deleted successfully' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only delete own cars' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AdminLessorSuperAdminGuard)
  async remove(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const userId = req.user.sub;
    return await this.carsService.remove(+id, userId);
  }
}
