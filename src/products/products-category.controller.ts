import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guard/rolesGuard';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductsService } from './products.service';

@ApiSecurity('X-AUTH-TOKEN')
@ApiTags('products-category')
@Controller('products-category')
export class ProductsCategoryController {
    constructor(private readonly productsService: ProductsService) {}

    @Get('/admin/all')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Получить все категории (админ)' })
    findAll() {
        return this.productsService.findAllCategories();
    }

    @Post('/admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Создать категорию (админ)' })
    create(@Body() dto: CreateProductCategoryDto) {
        return this.productsService.createCategory(dto);
    }

    @Patch('/admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Обновить категорию (админ)' })
    update(@Body() dto: UpdateProductCategoryDto) {
        return this.productsService.updateCategory(dto);
    }

    @Delete('/admin/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Удалить категорию (админ)' })
    delete(@Param('id') id: string) {
        return this.productsService.deleteCategory(+id);
    }
}
