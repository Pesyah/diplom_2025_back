import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../auth/entities/users.entity';
import { CoffeeAdditiveRelation } from '../coffee/entities/coffee-additive-relation.entity';
import { CoffeeVolumeRelation } from '../coffee/entities/coffee-volume-relation.entity';
import { Coffee } from '../coffee/entities/coffee.entity';
import { Products } from '../products/entities/product.entity';
import { UserRoleModule } from '../userRole/userRole.module';
import { OrderStatus } from './entities/order-status.entity';
import { OrdersItems } from './entities/orders-items.entity';
import { Orders } from './entities/orders.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Orders,
            OrdersItems,
            OrderStatus,
            Users,
            Coffee,
            CoffeeVolumeRelation,
            CoffeeAdditiveRelation,
            Products,
        ]),
        UserRoleModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}
