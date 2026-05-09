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
import { CreateCoffeeAdditiveDto } from './dto/create-coffee-additive.dto';
import { UpdateCoffeeAdditiveDto } from './dto/update-coffee-additive.dto';

@ApiSecurity('X-AUTH-TOKEN')
@ApiTags('coffee-additive')
@Controller('coffee-additive')
export class CoffeeAdditiveController {
    constructor(private readonly coffeeService: CoffeeService) {}

    // ===================== COFFEE ADDITIVE PUBLIC =====================

    // (публичные методы добавок уже есть в CoffeeController)
    // coffee/coffee-additive/by-coffee-volume/:coffeeVolumeRelationId

    // ===================== COFFEE ADDITIVE ADMIN =====================

    @Get('/admin/all')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Получить все справочные добавки (админ)' })
    findAll() {
        return this.coffeeService.findAllCoffeeAdditives();
    }

    @Post('/admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Создать справочную добавку (админ)' })
    create(@Body() dto: CreateCoffeeAdditiveDto) {
        return this.coffeeService.createCoffeeAdditive(dto);
    }

    @Patch('/admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Обновить справочную добавку (админ)' })
    update(@Body() dto: UpdateCoffeeAdditiveDto) {
        return this.coffeeService.updateCoffeeAdditive(dto);
    }

    @Delete('/admin/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Удалить справочную добавку (админ)' })
    delete(@Param('id') id: string) {
        return this.coffeeService.deleteCoffeeAdditive(+id);
    }
}
