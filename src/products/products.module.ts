import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsCategory } from './entities/product-category.entity';
import { Products } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    imports: [TypeOrmModule.forFeature([Products, ProductsCategory])],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {}
