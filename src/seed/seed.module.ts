import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleType } from 'src/auth/entities/user-roles.entity';
import { OrderStatus } from 'src/orders/entities/order-status.entity';
import { SeedService } from './seed.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserRoleType, OrderStatus])],
    providers: [SeedService],
})
export class SeedModule {}
