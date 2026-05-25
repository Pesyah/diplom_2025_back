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
import { CreateProducerDto } from './dto/create-producer.dto';
import { DeleteProducerDto } from './dto/delete-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ProductsService } from './products.service';

@ApiTags('admin/brands')
@ApiSecurity('X-AUTH-TOKEN')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/brands')
export class AdminBrandsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    @ApiOperation({ summary: 'Админ: список брендов с поиском и пагинацией' })
    findAdminBrands(@Query() dto: BaseSearchDto) {
        return this.productsService.findAdminBrands(dto);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Админ: деталка бренда с категориями и продуктами',
    })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    findAdminBrandById(
        @Param('id', ParseIntPipe) id: number,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.productsService.findAdminBrandById(
            id,
            page || 1,
            limit || 20,
        );
    }

    @Post()
    @ApiOperation({ summary: 'Админ: создать бренд' })
    createBrand(@Body() dto: CreateProducerDto) {
        return this.productsService.createProducer(dto);
    }

    @Patch()
    @ApiOperation({ summary: 'Админ: обновить бренд (id в body)' })
    updateBrand(@Body() dto: UpdateProducerDto) {
        return this.productsService.updateProducer(dto);
    }

    @Delete()
    @ApiOperation({ summary: 'Админ: удалить бренд (id в body)' })
    deleteBrand(@Body() dto: DeleteProducerDto) {
        return this.productsService.deleteProducer(dto);
    }
}
