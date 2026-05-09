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
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guard/rolesGuard';
import { CreateOrderDto } from './dto/create-order.dto';

import { CreateOrderItemAdminDto } from './dto/create-order-item.dto';
import { UpdateOrderAdminDto } from './dto/update-order-admin.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrdersService } from './orders.service';

@ApiSecurity('X-AUTH-TOKEN')
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    // ===================== USER =====================

    @Post()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Создать заказ (пользователь)' })
    create(@GetUser() user, @Body() dto: CreateOrderDto) {
        return this.ordersService.createOrder(user.id, dto);
    }

    @Get('/by-user')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Получить свои заказы (пользователь)' })
    findByUser(@GetUser() user) {
        return this.ordersService.findByUser(user.id);
    }

    @Get('/by-id/:id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Получить свой заказ по id (пользователь)' })
    findByIdForUser(@GetUser() user, @Param('id') id: string) {
        return this.ordersService.findByIdForUser(user.id, id);
    }

    @Patch('/cancel/:id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Отменить заказ (пользователь, только статус 1)' })
    cancel(@GetUser() user, @Param('id') id: string) {
        return this.ordersService.cancelOrder(user.id, id);
    }

    // ===================== ADMIN =====================

    @Get('/admin/all')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Получить все заказы (админ)' })
    findAllAdmin() {
        return this.ordersService.findAllAdmin();
    }

    @Get('/admin/by-id/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Получить заказ по id (админ)' })
    findByIdAdmin(@Param('id') id: string) {
        return this.ordersService.findByIdAdmin(id);
    }

    @Get('/admin/by-user/:userId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Получить заказы пользователя (админ)' })
    findByUserAdmin(@Param('userId') userId: string) {
        return this.ordersService.findByUserAdmin(userId);
    }

    @Patch('/admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Обновить статус заказа (админ)' })
    updateStatus(@Body() dto: UpdateOrderAdminDto) {
        return this.ordersService.updateStatus(dto);
    }

    @Post('/admin/items')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Добавить позицию в заказ (админ)' })
    addItem(@Body() dto: CreateOrderItemAdminDto) {
        return this.ordersService.addItem(dto);
    }

    @Patch('/admin/items')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Обновить позицию заказа (админ)' })
    updateItem(@Body() dto: UpdateOrderItemDto) {
        return this.ordersService.updateItem(dto);
    }

    @Delete('/admin/items/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Удалить позицию из заказа (админ)' })
    deleteItem(@Param('id') id: string) {
        return this.ordersService.deleteItem(id);
    }
}
