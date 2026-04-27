import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

import { Roles } from 'src/auth/decorators/role.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { GetProductsByQueryDto } from './dto/get-products-by-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('admin/products')
@ApiSecurity('X-AUTH-TOKEN')
@UseGuards(AuthGuard)
@Roles('admin')
@Controller('admin/products')
export class AdminProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    @ApiOperation({
        summary: 'Админ: список продуктов с фильтрами и пагинацией',
    })
    findAdminProducts(@Query() dto: GetProductsByQueryDto) {
        return this.productsService.findAdminProducts(dto);
    }

    @Post()
    @ApiOperation({ summary: 'Админ: создать продукт' })
    createProduct(@Body() dto: CreateProductDto) {
        return this.productsService.createProduct(dto);
    }

    @Patch()
    @ApiOperation({ summary: 'Админ: обновить продукт (id в body)' })
    updateProduct(@Body() dto: UpdateProductDto) {
        return this.productsService.updateProduct(dto);
    }

    @Delete()
    @ApiOperation({ summary: 'Админ: удалить продукт (id в body)' })
    deleteProduct(@Body() dto: DeleteProductDto) {
        return this.productsService.deleteProduct(dto);
    }
}
