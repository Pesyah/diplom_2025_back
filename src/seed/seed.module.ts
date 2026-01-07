import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleType } from 'src/auth/entities/user-roles.entity';
import { OrderStatus } from 'src/orders/entities/order-status.entity';
import { PizzaSize } from 'src/pizza/entities/pizza-size.entity';
import { PizzaType } from 'src/pizza/entities/pizza-type.entity';
import { SeedService } from './seed.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserRoleType,
            OrderStatus,
            PizzaType,
            PizzaSize,
        ]),
    ],
    providers: [SeedService],
})
export class SeedModule {}
