import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guard/rolesGuard';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomsService } from './rooms.service';

@ApiSecurity('X-AUTH-TOKEN')
@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    // ======================== GET ========================

    @Get('all')
    @ApiOperation({
        summary: 'Получить все номера (для гостей, без удалённых)',
    })
    async findAll() {
        return this.roomsService.findAll();
    }

    @Get('all-admin')
    @ApiOperation({
        summary: 'Получить все номера (для админов, включая удалённые)',
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    async findAllAdmin() {
        return this.roomsService.findAllAdmin();
    }

    @Get('by-id/:id')
    @ApiOperation({
        summary: 'Получить номер по ID (для гостей, только активные)',
    })
    async findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.roomsService.findById(id);
    }

    @Get('all-relations')
    @ApiOperation({ summary: 'Получить все удобства, типы и статусы' })
    async getAllRelations() {
        return this.roomsService.getAllRelations();
    }

    // ======================== POST ========================

    @Post()
    @ApiOperation({ summary: 'Создать номер (admin)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    async create(@Body() dto: CreateRoomDto) {
        return this.roomsService.create(dto);
    }

    @Post('amenities')
    @ApiOperation({ summary: 'Создать удобство (admin)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    async createAmenity(@Body() dto: CreateAmenityDto) {
        return this.roomsService.createAmenity(dto);
    }

    @Post('restore/by-id/:id')
    @ApiOperation({ summary: 'Восстановить удалённый номер (admin)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    async restore(@Param('id', ParseUUIDPipe) id: string) {
        return this.roomsService.restore(id);
    }

    // ======================== PATCH ========================

    @Patch()
    @ApiOperation({ summary: 'Обновить номер (admin)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    async update(@Body() dto: UpdateRoomDto) {
        return this.roomsService.update(dto);
    }

    @Patch('amenities')
    @ApiOperation({ summary: 'Обновить удобство (admin)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    async updateAmenity(@Body() dto: UpdateAmenityDto) {
        return this.roomsService.updateAmenity(dto);
    }

    @Patch('set-occupied/by-id/:id')
    @ApiOperation({ summary: 'Установить статус "Занят" (система/крон)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'manager')
    async setOccupied(@Param('id', ParseUUIDPipe) id: string) {
        return this.roomsService.setRoomOccupied(id);
    }

    @Patch('set-available/by-id/:id')
    @ApiOperation({ summary: 'Установить статус "Доступен" (система/крон)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'manager')
    async setAvailable(@Param('id', ParseUUIDPipe) id: string) {
        return this.roomsService.setRoomAvailable(id);
    }

    @Patch('set-maintenance/by-id/:id')
    @ApiOperation({
        summary: 'Установить статус "На обслуживании" (admin, manager)',
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'manager')
    async setMaintenance(@Param('id', ParseUUIDPipe) id: string) {
        return this.roomsService.setRoomMaintenance(id);
    }

    // ======================== DELETE ========================

    @Delete('by-id/:id')
    @ApiOperation({ summary: 'Мягкое удаление номера (admin)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.roomsService.softDelete(id);
    }

    @Delete('amenities/by-id/:id')
    @ApiOperation({ summary: 'Удалить удобство (admin)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    async deleteAmenity(@Param('id') id: number) {
        return this.roomsService.deleteAmenity(id);
    }
}
