import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersParts } from './entities/order-part.entity';
import { OrderStatus } from './entities/order-status.entity';
import { Orders } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
    imports: [TypeOrmModule.forFeature([Orders, OrdersParts, OrderStatus])],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}
