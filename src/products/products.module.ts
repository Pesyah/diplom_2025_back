import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsPriceHistory } from './entities/products-price-history.entity';
import { Products } from './entities/products.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductsPriceHistory, Products])],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {}
