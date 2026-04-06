// orders.controller.ts
import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Users } from 'src/auth/entities/users.entity';
import { RolesGuard } from 'src/auth/guard/rolesGuard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get('all-relations')
    async allRelations() {
        return this.ordersService.allRelations();
    }

    @Post()
    async createOrder(@Req() req, @Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.createOrder(createOrderDto, req.user.id);
    }

    @Get('my')
    async getUserOrders(
        @GetUser() users: Users,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.ordersService.getUserOrders(
            users.id,
            page ? +page : 1,
            limit ? +limit : 20,
        );
    }

    @Get('by-id/:id')
    async getOrderById(@Param('id', ParseUUIDPipe) id: string) {
        return this.ordersService.getOrderById(id);
    }

    @Patch('admin/change-status/:id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async updateOrderStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    ) {
        return this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
    }

    @Patch('admin/cancel/:id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async cancelOrder(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
        return this.ordersService.cancelOrder(
            id,
            req.user.id,
            req.user.role === 'admin',
        );
    }

    @Get('admin/all')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async getAllOrders(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.ordersService.getAllOrders(
            page ? +page : 1,
            limit ? +limit : 20,
        );
    }

    @Get('admin/stats/overview')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async getOrderStats() {
        return this.ordersService.getOrderStats();
    }
}
