import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleType } from 'src/auth/entities/user-roles.entity';
import { Users } from 'src/auth/entities/users.entity';
import { OrdersStatus } from 'src/orders/entities/orders-status.entity';
import { Producers } from 'src/products/entities/producers.entity';
import { ProductsCategory } from 'src/products/entities/products-category.entity';
import { SeedService } from './seed.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserRoleType,
            ProductsCategory,
            Producers,
            OrdersStatus,
            Users,
        ]),
    ],
    providers: [SeedService],
})
export class SeedModule {}
