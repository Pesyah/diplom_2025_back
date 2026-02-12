import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersItem } from './entities/orders-item.entity';
import { OrdersStatus } from './entities/orders-status.entity';
import { Orders } from './entities/orders.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrdersStatus, Orders, OrdersItem])],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}
