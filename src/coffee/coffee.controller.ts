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
import { CreateCoffeeAdditiveRelationDto } from './dto/create-coffee-additive-relation.dto';
import { CreateCoffeeVolumeRelationDto } from './dto/create-coffee-volume-relation.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeAdditiveRelationDto } from './dto/update-coffee-additive-relation.dto';
import { UpdateCoffeeVolumeRelationDto } from './dto/update-coffee-volume-relation.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@ApiSecurity('X-AUTH-TOKEN')
@ApiTags('coffee')
@Controller('coffee')
export class CoffeeController {
    constructor(private readonly coffeeService: CoffeeService) {}

    // ===================== COFFEE PUBLIC =====================

    @Get('/all')
    @ApiOperation({ summary: 'Получить все активные кофе (публичный)' })
    findAllActive() {
        return this.coffeeService.findAllActive();
    }

    @Get('/by-id/:id')
    @ApiOperation({ summary: 'Получить кофе по id (публичный)' })
    findById(@Param('id') id: string) {
        return this.coffeeService.findById(id);
    }

    // ===================== COFFEE ADMIN =====================

    @Get('/admin/all')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Получить все кофе включая удаленные (админ)' })
    findAllAdmin() {
        return this.coffeeService.findAllAdmin();
    }

    // @Get('/admin/deleted')
    // @UseGuards(AuthGuard, RolesGuard)
    // @Roles('admin', 'moderator')
    // @ApiOperation({ summary: 'Получить только удаленные кофе (админ)' })
    // findDeletedAdmin() {
    //     return this.coffeeService.findDeletedAdmin();
    // }

    @Post('/admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Создать кофе (админ)' })
    create(@Body() dto: CreateCoffeeDto) {
        return this.coffeeService.create(dto);
    }

    @Patch('/admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Обновить кофе (админ)' })
    update(@Body() dto: UpdateCoffeeDto) {
        return this.coffeeService.update(dto);
    }

    @Delete('/admin/soft/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Мягкое удаление кофе (админ)' })
    softDelete(@Param('id') id: string) {
        return this.coffeeService.softDelete(id);
    }

    @Post('/admin/restore/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Восстановить кофе (админ)' })
    restore(@Param('id') id: string) {
        return this.coffeeService.restore(id);
    }

    // ===================== COFFEE VOLUME RELATION PUBLIC =====================

    @Get('/coffee-volume/by-coffee/:coffeeId')
    @ApiOperation({
        summary: 'Получить объемы для конкретного кофе (публичный)',
    })
    findVolumeRelationsByCoffee(@Param('coffeeId') coffeeId: string) {
        return this.coffeeService.findVolumeRelationsByCoffee(coffeeId);
    }

    // ===================== COFFEE VOLUME RELATION ADMIN =====================

    @Get('/coffee-volume/admin/all')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Получить все связи кофе-объем (админ)' })
    findAllVolumeRelationsAdmin() {
        return this.coffeeService.findAllVolumeRelationsAdmin();
    }

    @Post('/coffee-volume/admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Создать связь кофе-объем (админ)' })
    createVolumeRelation(@Body() dto: CreateCoffeeVolumeRelationDto) {
        return this.coffeeService.createVolumeRelation(dto);
    }

    @Patch('/coffee-volume/admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Обновить связь кофе-объем (админ)' })
    updateVolumeRelation(@Body() dto: UpdateCoffeeVolumeRelationDto) {
        return this.coffeeService.updateVolumeRelation(dto);
    }

    @Delete('/coffee-volume/admin/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Удалить связь кофе-объем (админ)' })
    deleteVolumeRelation(@Param('id') id: string) {
        return this.coffeeService.deleteVolumeRelation(+id);
    }

    // ===================== COFFEE ADDITIVE RELATION PUBLIC =====================

    @Get('/coffee-additive/by-coffee-volume/:coffeeVolumeRelationId')
    @ApiOperation({
        summary: 'Получить добавки для конкретной связи кофе-объем (публичный)',
    })
    findAdditiveRelationsByCoffeeVolume(
        @Param('coffeeVolumeRelationId') coffeeVolumeRelationId: string,
    ) {
        return this.coffeeService.findAdditiveRelationsByCoffeeVolume(
            +coffeeVolumeRelationId,
        );
    }

    // ===================== COFFEE ADDITIVE RELATION ADMIN =====================

    @Get('/coffee-additive/admin/all')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Получить все связи объем-добавка (админ)' })
    findAllAdditiveRelationsAdmin() {
        return this.coffeeService.findAllAdditiveRelationsAdmin();
    }

    @Post('/coffee-additive/admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Создать связь объем-добавка (админ)' })
    createAdditiveRelation(@Body() dto: CreateCoffeeAdditiveRelationDto) {
        return this.coffeeService.createAdditiveRelation(dto);
    }

    @Patch('/coffee-additive/admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Обновить связь объем-добавка (админ)' })
    updateAdditiveRelation(@Body() dto: UpdateCoffeeAdditiveRelationDto) {
        return this.coffeeService.updateAdditiveRelation(dto);
    }

    @Delete('/coffee-additive/admin/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @ApiOperation({ summary: 'Удалить связь объем-добавка (админ)' })
    deleteAdditiveRelation(@Param('id') id: string) {
        return this.coffeeService.deleteAdditiveRelation(+id);
    }
}
