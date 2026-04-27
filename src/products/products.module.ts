import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { AdminBrandsController } from './admin-brands.controller';
import { AdminCategoriesController } from './admin-categories.controller';
import { AdminProductsController } from './admin-products.controller';
import { Producers } from './entities/producers.entity';
import { ProductsCategory } from './entities/products-category.entity';
import { Products } from './entities/products.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Products,
            Producers,
            ProductsCategory,
            Users,
        ]),
    ],
    controllers: [
        ProductsController,
        AdminProductsController,
        AdminBrandsController,
        AdminCategoriesController,
    ],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule {}
