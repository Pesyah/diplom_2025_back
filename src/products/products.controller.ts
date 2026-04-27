import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetProductsByQueryDto } from './dto/get-products-by-query.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get('all-relations')
    @ApiOperation({ summary: 'Получить справочники (бренды и категории)' })
    allRelations() {
        return this.productsService.allRelations();
    }

    @Get('by-id/:id')
    @ApiOperation({ summary: 'Получить продукт по id' })
    findProductById(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.findProductById(id);
    }

    @Get('by-query')
    @ApiOperation({ summary: 'Поиск продуктов с фильтрами и пагинацией' })
    findProductsByQuery(@Query() dto: GetProductsByQueryDto) {
        return this.productsService.findProductsByQuery(dto);
    }

    @Get('brands/:brandId')
    @ApiOperation({ summary: 'Страница бренда с категориями и продуктами' })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    findBrandWithProducts(
        @Param('brandId', ParseIntPipe) brandId: number,
        @Query('search') search?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.productsService.findBrandWithProducts(
            brandId,
            search,
            page || 1,
            limit || 20,
        );
    }

    @Get('brands/:brandId/by-query')
    @ApiOperation({ summary: 'Поиск продуктов внутри бренда' })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    findProductsInBrand(
        @Param('brandId', ParseIntPipe) brandId: number,
        @Query('search') search?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.productsService.findBrandWithProducts(
            brandId,
            search,
            page || 1,
            limit || 20,
        );
    }
}
