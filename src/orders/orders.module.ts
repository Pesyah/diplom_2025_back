import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { PizzaAdditiveRelation } from 'src/pizza/entities/pizza-additive-relations.entity';
import { PizzaSizeRelation } from 'src/pizza/entities/pizza-size-relations.entity';
import { OrdersParts } from './entities/order-part.entity';
import { OrderStatus } from './entities/order-status.entity';
import { Orders } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Orders,
            OrdersParts,
            OrderStatus,
            PizzaSizeRelation,
            PizzaAdditiveRelation,
            Users,
        ]),
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}
