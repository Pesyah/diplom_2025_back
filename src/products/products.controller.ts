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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiSecurity('X-AUTH-TOKEN')
@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    // ===================== PUBLIC =====================

    @Get('/all')
    @ApiOperation({ summary: 'Получить все активные продукты (публичный)' })
    findAllActive() {
        return this.productsService.findAllActive();
    }

    @Get('/by-id/:id')
    @ApiOperation({ summary: 'Получить продукт по id (публичный)' })
    findById(@Param('id') id: string) {
        return this.productsService.findById(id);
    }

    // ===================== ADMIN =====================

    @Get('/admin/all')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({
        summary: 'Получить все продукты включая удаленные (админ)',
    })
    findAllAdmin() {
        return this.productsService.findAllAdmin();
    }

    @Get('/admin/deleted')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Получить только удаленные продукты (админ)' })
    findDeletedAdmin() {
        return this.productsService.findDeletedAdmin();
    }

    @Post('/admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Создать продукт (админ)' })
    create(@Body() dto: CreateProductDto) {
        return this.productsService.create(dto);
    }

    @Patch('/admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Обновить продукт (админ)' })
    update(@Body() dto: UpdateProductDto) {
        return this.productsService.update(dto);
    }

    @Delete('/admin/soft/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Мягкое удаление продукта (админ)' })
    softDelete(@Param('id') id: string) {
        return this.productsService.softDelete(id);
    }

    @Post('/admin/restore/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Восстановить продукт (админ)' })
    restore(@Param('id') id: string) {
        return this.productsService.restore(id);
    }
}
