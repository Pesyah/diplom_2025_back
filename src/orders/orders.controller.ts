import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Users } from 'src/auth/entities/users.entity';
import { RolesGuard } from 'src/auth/guard/rolesGuard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@ApiSecurity('X-AUTH-TOKEN')
@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    // USER ROUTES
    @Get('my')
    @ApiOperation({ summary: 'Получить заказы текущего пользователя' })
    async getMyOrders(@GetUser() user: Users) {
        return this.ordersService.getUserOrders(user.id);
    }

    @Get('by-id/:id')
    @ApiOperation({ summary: 'Получить заказ по ID (только свои заказы)' })
    async getMyOrderById(@Param('id') id: string, @GetUser() user: Users) {
        return this.ordersService.getUserOrderById(id, user.id);
    }

    @Post()
    @ApiOperation({ summary: 'Создать новый заказ' })
    async createOrder(@Body() dto: CreateOrderDto, @GetUser() user: Users) {
        return this.ordersService.createOrder(user.id, dto);
    }

    // ADMIN ROUTES
    @Get()
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: '(Admin) Получить все заказы' })
    async getAllOrders() {
        return this.ordersService.getAllOrders();
    }

    @Get('statuses')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: '(Admin) Получить статусы заказов' })
    async getStatuses() {
        return this.ordersService.getStatuses();
    }

    @Get('admin/by-id/:id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: '(Admin) Получить заказ по ID' })
    async getOrderById(@Param('id') id: string) {
        return this.ordersService.getOrderById(id);
    }

    @Patch('by-id/:id/status')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: '(Admin) Изменить статус заказа' })
    async updateOrderStatus(
        @Param('id') id: string,
        @Body() dto: UpdateOrderStatusDto,
    ) {
        return this.ordersService.updateOrderStatus(id, dto);
    }

    @Delete('by-id/:id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: '(Admin) Удалить заказ' })
    async deleteOrder(@Param('id') id: string) {
        await this.ordersService.deleteOrder(id);
        return { message: 'Заказ успешно удалён' };
    }
}
