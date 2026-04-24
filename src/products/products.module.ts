import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producers } from './entities/producers.entity';
import { ProductsCategory } from './entities/products-category.entity';
import { ProductsPriceHistory } from './entities/products-price-history.entity';
import { Products } from './entities/products.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Producers,
            ProductsCategory,
            ProductsPriceHistory,
            Products,
        ]),
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {}
