import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guard/rolesGuard';
import { BaseSearchDto } from 'src/common/dto/base-search.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ProductsService } from './products.service';

@ApiTags('admin/categories')
@ApiSecurity('X-AUTH-TOKEN')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/categories')
export class AdminCategoriesController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    @ApiOperation({ summary: 'Админ: список категорий с поиском и пагинацией' })
    findAdminCategories(@Query() dto: BaseSearchDto) {
        return this.productsService.findAdminCategories(dto);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Админ: деталка категории с брендами и продуктами',
    })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiOperation({ summary: 'Админ: список категорий с поиском и пагинацией' })
    findAdminCategoriesById(
        @Param('id', ParseIntPipe) id: number,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.productsService.findAdminCategoriesById(
            id,
            page || 1,
            limit || 20,
        );
    }

    @Post()
    @ApiOperation({ summary: 'Админ: создать категорию' })
    createCategory(@Body() dto: CreateCategoryDto) {
        return this.productsService.createCategory(dto);
    }

    @Patch()
    @ApiOperation({ summary: 'Админ: обновить категорию (id в body)' })
    updateCategory(@Body() dto: UpdateCategoryDto) {
        return this.productsService.updateCategory(dto);
    }

    @Delete()
    @ApiOperation({ summary: 'Админ: удалить категорию (id в body)' })
    deleteCategory(@Body() dto: DeleteCategoryDto) {
        return this.productsService.deleteCategory(dto);
    }
}
