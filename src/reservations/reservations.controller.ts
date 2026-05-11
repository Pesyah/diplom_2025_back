import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Users } from 'src/auth/entities/users.entity';
import { RolesGuard } from 'src/auth/guard/rolesGuard';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsService } from './reservations.service';

@ApiSecurity('X-AUTH-TOKEN')
@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) {}

    // ======================== GET ========================

    @Get('all')
    @ApiOperation({ summary: 'Получить все бронирования (admin, manager)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'manager')
    async findAll() {
        return this.reservationsService.findAll();
    }

    @Get('my')
    @ApiOperation({ summary: 'Получить свои бронирования (guest)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'manager', 'guest')
    async findMy(@GetUser() user: Users) {
        return this.reservationsService.findByUser(user.id);
    }

    @Get('by-id/:id')
    @ApiOperation({ summary: 'Получить бронирование по ID' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'manager', 'guest')
    async findById(
        @Param('id', ParseUUIDPipe) id: string,
        @GetUser() user: Users,
    ) {
        // Для guest — проверяем принадлежность, для admin/manager — нет
        const userId = user.roleType?.id === 1 ? user.id : undefined;
        return this.reservationsService.findById(id, userId);
    }

    // ======================== POST ========================

    @Post()
    @ApiOperation({ summary: 'Создать бронирование (guest)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'manager', 'guest')
    async create(@Body() dto: CreateReservationDto, @GetUser() user: Users) {
        return this.reservationsService.create(dto, user.id);
    }

    // ======================== PATCH ========================

    @Patch('update/:id')
    @ApiOperation({ summary: 'Редактировать бронирование (admin, manager)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'manager')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateReservationDto,
    ) {
        return this.reservationsService.update(id, dto);
    }

    @Patch('confirm/:id')
    @ApiOperation({ summary: 'Подтвердить бронирование (admin, manager)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'manager')
    async confirm(@Param('id', ParseUUIDPipe) id: string) {
        return this.reservationsService.confirm(id);
    }

    @Patch('check-in/:id')
    @ApiOperation({ summary: 'Заселить гостя (admin, manager)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'manager')
    async checkIn(@Param('id', ParseUUIDPipe) id: string) {
        return this.reservationsService.checkIn(id);
    }

    @Patch('check-out/:id')
    @ApiOperation({ summary: 'Выселить гостя (admin, manager)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'manager')
    async checkOut(@Param('id', ParseUUIDPipe) id: string) {
        return this.reservationsService.checkOut(id);
    }

    @Patch('cancel/:id')
    @ApiOperation({
        summary:
            'Отменить бронирование (guest — только своё, admin/manager — любое)',
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'manager', 'guest')
    async cancel(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: CancelReservationDto,
        @GetUser() user: Users,
    ) {
        const userId = user.roleType?.id === 1 ? user.id : undefined;
        return this.reservationsService.cancel(id, dto, userId);
    }
}
