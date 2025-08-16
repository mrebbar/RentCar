import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserGuard } from '../guard/user.guard';
import { AdminLessorSuperAdminGuard } from '../guard/adminLessorSuperAdmin.guard';
import { OrderStatus } from './entities/order.entity';
import { JwtService } from '@nestjs/jwt';
import { AllGuard } from 'src/guard/All.guard';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam,
  ApiBody 
} from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ 
    summary: 'Create a new order', 
    description: 'Create a new car rental order. Requires User role.' 
  })
  @ApiBody({ 
    type: CreateOrderDto,
    description: 'Order creation data',
    examples: {
      basic: {
        summary: 'Basic Order',
        value: {
          carId: 1,
          startDate: '2024-01-15',
          endDate: '2024-01-20',
          count: 1
        }
      },
      multiple: {
        summary: 'Multiple Cars Order',
        value: {
          carId: 2,
          startDate: '2024-02-01',
          endDate: '2024-02-05',
          count: 2
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Order created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        carId: { type: 'number', example: 1 },
        userId: { type: 'number', example: 1 },
        startDate: { type: 'string', example: '2024-01-15' },
        endDate: { type: 'string', example: '2024-01-20' },
        count: { type: 'number', example: 1 },
        totalPrice: { type: 'number', example: 250.00 },
        status: { type: 'string', example: 'Pending' },
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
            email: { type: 'string', example: 'john@example.com' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error or insufficient car count' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(UserGuard)
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    // User ID ni JWT tokendan olish
    const token = req.headers['authorization']?.split(' ')[1];
    const data = this.jwtService.verify(token);
    createOrderDto.userId = data.sub;

    return await this.orderService.create(createOrderDto);
  }

  @ApiOperation({ 
    summary: 'Get all orders', 
    description: 'Retrieve all orders. Requires Admin, Lessor, or SuperAdmin role.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all orders',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          carId: { type: 'number', example: 1 },
          userId: { type: 'number', example: 1 },
          startDate: { type: 'string', example: '2024-01-15' },
          endDate: { type: 'string', example: '2024-01-20' },
          count: { type: 'number', example: 1 },
          totalPrice: { type: 'number', example: 250.00 },
          status: { type: 'string', example: 'Pending' },
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
              email: { type: 'string', example: 'john@example.com' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiBearerAuth()
  @Get()
  @UseGuards(AdminLessorSuperAdminGuard)
  async findAll() {
    return await this.orderService.findAll();
  }

  @ApiOperation({ 
    summary: 'Get my active orders', 
    description: 'Retrieve current user\'s active orders. Requires User role.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of user\'s active orders',
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
          status: { type: 'string', example: 'Pending' },
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
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiBearerAuth()
  @Get('my-active-orders')
  @UseGuards(UserGuard)
  async findMyOrders(@Req() req: any) {
    return await this.orderService.findUserActiveOrders(req.user.sub);
  }

  @ApiOperation({ 
    summary: 'Get order by ID', 
    description: 'Retrieve a specific order. Users can only see their own orders.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Order ID',
    example: 1,
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Order details',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        carId: { type: 'number', example: 1 },
        userId: { type: 'number', example: 1 },
        startDate: { type: 'string', example: '2024-01-15' },
        endDate: { type: 'string', example: '2024-01-20' },
        count: { type: 'number', example: 1 },
        totalPrice: { type: 'number', example: 250.00 },
        status: { type: 'string', example: 'Pending' },
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
            email: { type: 'string', example: 'john@example.com' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only view own orders' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AllGuard)
  async findOne(@Param('id') id: string, @Req() req: any) {
    const order = await this.orderService.findOne(+id);

    // User o'z orderini ko'ra oladi, Admin/Lessor/SuperAdmin barchasini
    if (
      (req.user.role === 'User' || req.user.role === 'Lessor') &&
      order.user.id !== req.user.sub
    ) {
      throw new ForbiddenException(
        "Siz faqat o'z orderlaringizni ko'ra olasiz",
      );
    }

    return order;
  }

  @ApiOperation({ 
    summary: 'Update order', 
    description: 'Update order details. Users can only cancel their own orders.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Order ID to update',
    example: 1,
    type: 'number'
  })
  @ApiBody({ 
    type: UpdateOrderDto,
    description: 'Order update data',
    examples: {
      cancel: {
        summary: 'Cancel Order',
        value: {
          status: 'Cancelled'
        }
      },
      updateStatus: {
        summary: 'Update Status (Admin/Lessor)',
        value: {
          status: 'Completed'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Order updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        status: { type: 'string', example: 'Cancelled' },
        message: { type: 'string', example: 'Order updated successfully' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only update own orders' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AdminLessorSuperAdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: any,
  ) {
    const order = await this.orderService.findOne(+id);

    // User o'z orderini o'zgartira oladi, Admin/Lessor/SuperAdmin barchasini
    if (
      (req.user.role === 'User' || req.user.role === 'Lessor') &&
      order.user.id !== req.user.sub
    ) {
      throw new ForbiddenException(
        "Siz faqat o'z orderlaringizni o'zgartira olasiz",
      );
    }

    // User faqat o'z orderini bekor qilishi mumkin, status ni o'zgartira olmaydi
    if (req.user.role === 'User') {
      if (
        updateOrderDto.status &&
        updateOrderDto.status !== OrderStatus.Cancelled
      ) {
        throw new ForbiddenException(
          'Siz faqat orderni bekor qilishingiz mumkin',
        );
      }
      // User orderni bekor qilganda status ni Cancelled qilamiz
      updateOrderDto.status = OrderStatus.Cancelled;
    }

    return await this.orderService.update(+id, updateOrderDto);
  }

  @ApiOperation({ 
    summary: 'Complete order', 
    description: 'Mark order as completed. Requires Admin, Lessor, or SuperAdmin role.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Order ID to complete',
    example: 1,
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Order completed successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        status: { type: 'string', example: 'Completed' },
        message: { type: 'string', example: 'Order completed successfully' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiBearerAuth()
  @Patch(':id/complete')
  @UseGuards(AdminLessorSuperAdminGuard)
  async completeOrder(@Param('id') id: string, @Req() req: any) {
    const order = await this.orderService.findOne(+id);

    // User o'z orderini tugatishningiz mumkin, Lessor barchasini
    if (req.user.role === 'Lessor' && req.user.sub !== order.user.id) {
      throw new ForbiddenException(
        "Siz faqat o'z orderlaringizni tugatishningiz mumkin",
      );
    }
    return await this.orderService.completeOrder(+id);
  }

  @ApiOperation({ 
    summary: 'Delete order', 
    description: 'Delete an order. Users can only delete their own orders.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Order ID to delete',
    example: 1,
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Order deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        message: { type: 'string', example: 'Order deleted successfully' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only delete own orders' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AdminLessorSuperAdminGuard)
  async remove(@Param('id') id: string, @Req() req: any) {
    const order = await this.orderService.findOne(+id);

    // User o'z orderini o'chira oladi, Admin/Lessor/SuperAdmin barchasini
    if (req.user.role === 'User' && order.user.id !== req.user.sub) {
      throw new ForbiddenException(
        "Siz faqat o'z orderlaringizni o'chira olasiz",
      );
    }

    return await this.orderService.remove(+id);
  }
}
