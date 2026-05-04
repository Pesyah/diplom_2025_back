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
import { CoffeeService } from './coffee.service';
import { CreateCoffeeVolumeDto } from './dto/create-coffee-volume.dto';
import { UpdateCoffeeVolumeDto } from './dto/update-coffee-volume.dto';

@ApiSecurity('X-AUTH-TOKEN')
@ApiTags('coffee-volume')
@Controller('coffee-volume')
export class CoffeeVolumeController {
    constructor(private readonly coffeeService: CoffeeService) {}

    // ===================== COFFEE VOLUME PUBLIC =====================

    // (публичные методы объемов уже есть в CoffeeController)
    // coffee/coffee-volume/by-coffee/:coffeeId

    // ===================== COFFEE VOLUME ADMIN =====================

    @Get('/admin/all')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Получить все справочные объемы (админ)' })
    findAll() {
        return this.coffeeService.findAllCoffeeVolumes();
    }

    @Post('/admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Создать справочный объем (админ)' })
    create(@Body() dto: CreateCoffeeVolumeDto) {
        return this.coffeeService.createCoffeeVolume(dto);
    }

    @Patch('/admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Обновить справочный объем (админ)' })
    update(@Body() dto: UpdateCoffeeVolumeDto) {
        return this.coffeeService.updateCoffeeVolume(dto);
    }

    @Delete('/admin/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Удалить справочный объем (админ)' })
    delete(@Param('id') id: string) {
        return this.coffeeService.deleteCoffeeVolume(+id);
    }
}
