import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { UserRoleModule } from '../userRole/userRole.module';
import { ProductsCategory } from './entities/product-category.entity';
import { Products } from './entities/product.entity';
import { ProductsCategoryController } from './products-category.controller';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Products, ProductsCategory, Users]),
        UserRoleModule,
    ],
    controllers: [ProductsController, ProductsCategoryController],
    providers: [ProductsService],
})
export class ProductsModule {}
