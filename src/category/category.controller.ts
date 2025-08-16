import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AdminOrSuperAdminGuard } from 'src/guard/SuperAdminOrAdmin.guard';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam,
  ApiBody 
} from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ 
    summary: 'Create a new category', 
    description: 'Create a new car category. Requires Admin or SuperAdmin role.' 
  })
  @ApiBody({ 
    type: CreateCategoryDto,
    description: 'Category creation data',
    examples: {
      sedan: {
        summary: 'Sedan Category',
        value: {
          name: 'Sedan',
          description: 'Sedan avtomobillar - oddiy va qulay',
          isActive: true
        }
      },
      suv: {
        summary: 'SUV Category',
        value: {
          name: 'SUV',
          description: 'SUV avtomobillar - katta va kuchli',
          isActive: true
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Category created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Sedan' },
        description: { type: 'string', example: 'Sedan avtomobillar - oddiy va qulay' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error or category already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AdminOrSuperAdminGuard)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ 
    summary: 'Get all categories', 
    description: 'Retrieve all available car categories' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all categories',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Sedan' },
          description: { type: 'string', example: 'Sedan avtomobillar - oddiy va qulay' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          cars: {
            type: 'array',
            items: {
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
    }
  })
  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @ApiOperation({ 
    summary: 'Get category by ID', 
    description: 'Retrieve a specific category by its ID' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Category ID',
    example: 1,
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Category details',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Sedan' },
        description: { type: 'string', example: 'Sedan avtomobillar - oddiy va qulay' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        cars: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              brand: { type: 'string', example: 'Toyota' },
              model: { type: 'string', example: 'Camry' },
              year: { type: 'number', example: 2022 },
              color: { type: 'string', example: 'White' },
              price: { type: 'number', example: 50.00 }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(+id);
  }

  @ApiOperation({ 
    summary: 'Update category', 
    description: 'Update category details. Requires Admin or SuperAdmin role.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Category ID to update',
    example: 1,
    type: 'number'
  })
  @ApiBody({ 
    type: UpdateCategoryDto,
    description: 'Category update data',
    examples: {
      updateName: {
        summary: 'Update Name',
        value: {
          name: 'Updated Sedan'
        }
      },
      updateDescription: {
        summary: 'Update Description',
        value: {
          description: 'Yangi sedan avtomobillar tavsifi'
        }
      },
      deactivate: {
        summary: 'Deactivate Category',
        value: {
          isActive: false
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Category updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Updated Sedan' },
        description: { type: 'string', example: 'Yangi sedan avtomobillar tavsifi' },
        isActive: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Category updated successfully' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AdminOrSuperAdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(+id, updateCategoryDto);
  }

  @ApiOperation({ 
    summary: 'Delete category', 
    description: 'Delete a category. Requires Admin or SuperAdmin role.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Category ID to delete',
    example: 1,
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Category deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Sedan' },
        message: { type: 'string', example: 'Category deleted successfully' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AdminOrSuperAdminGuard)
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(+id);
  }
}
