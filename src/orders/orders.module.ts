import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { CoffeeAdditiveRelation } from 'src/coffee/entities/coffee-additive-relation.entity';
import { CoffeeVolumeRelation } from 'src/coffee/entities/coffee-volume-relation.entity';
import { Coffee } from 'src/coffee/entities/coffee.entity';
import { Products } from 'src/products/entities/product.entity';
import { OrderStatus } from './entities/order-status.entity';
import { OrdersItems } from './entities/orders-items.entity';
import { Orders } from './entities/orders.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Coffee,
            CoffeeAdditiveRelation,
            CoffeeVolumeRelation,
            Orders,
            OrdersItems,
            OrderStatus,
            Products,
            Users,
        ]),
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}
