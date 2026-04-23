// alerts.controller.ts
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';
import { AlertsService } from './alerts.service';

import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Users } from 'src/auth/entities/users.entity';
import { CreateAlertDto, UpdateAlertDto } from './dto/create-alert.dto';
import {
    CreateGlobalAlertDto,
    UpdateGlobalAlertDto,
} from './dto/global-alert.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Alerts } from './entities/alerts.entity';
import { GlobalAlerts } from './entities/global-alerts.entity';

@ApiSecurity('X-AUTH-TOKEN')
@ApiTags('Уведомления')
@UseGuards(AuthGuard)
@Controller('alerts')
export class AlertsController {
    constructor(private readonly alertsService: AlertsService) {}

    // ==================== ALERTS ====================
    @Post()
    @ApiOperation({ summary: 'Создать уведомление' })
    @ApiResponse({ status: 201, type: Alerts })
    createAlert(
        @Body() dto: CreateAlertDto,
        @GetUser() user: Users,
    ): Promise<Alerts> {
        return this.alertsService.createAlert(dto, user);
    }

    @Get('all')
    @ApiOperation({ summary: 'Получить список уведомлений с пагинацией' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiResponse({
        status: 200,
        description: 'Объект с массивом данных и общим количеством',
    })
    findAllAlerts(@Query() pagination: PaginationDto, @GetUser() user: Users) {
        return this.alertsService.findAllAlerts(pagination, user);
    }

    @Get('by-id/:id')
    @ApiOperation({ summary: 'Получить уведомление по ID' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, type: Alerts })
    findOneAlert(@Param('id', ParseUUIDPipe) id: string): Promise<Alerts> {
        return this.alertsService.findOneAlert(id);
    }

    @Patch('update/:id')
    @ApiOperation({ summary: 'Обновить уведомление' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, type: Alerts })
    updateAlert(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateAlertDto,
    ): Promise<Alerts> {
        return this.alertsService.updateAlert(id, dto);
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: 'Удалить уведомление' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 204 })
    async removeAlert(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        await this.alertsService.removeAlert(id);
    }

    // ==================== GLOBAL ALERTS ====================
    @Post('global')
    @ApiOperation({ summary: 'Создать глобальное уведомление' })
    @ApiResponse({ status: 201, type: GlobalAlerts })
    createGlobalAlert(
        @Body() dto: CreateGlobalAlertDto,
        @GetUser() user: Users,
    ): Promise<GlobalAlerts> {
        return this.alertsService.createGlobalAlert(dto, user);
    }

    @Get('global')
    @ApiOperation({
        summary: 'Получить список глобальных уведомлений с пагинацией',
    })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiResponse({
        status: 200,
        description: 'Объект с массивом данных и общим количеством',
    })
    findAllGlobalAlerts(@Query() pagination: PaginationDto) {
        return this.alertsService.findAllGlobalAlerts(pagination);
    }

    @Get('global/:id')
    @ApiOperation({ summary: 'Получить глобальное уведомление по ID' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, type: GlobalAlerts })
    findOneGlobalAlert(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<GlobalAlerts> {
        return this.alertsService.findOneGlobalAlert(id);
    }

    @Patch('global/:id')
    @ApiOperation({ summary: 'Обновить глобальное уведомление' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, type: GlobalAlerts })
    updateGlobalAlert(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateGlobalAlertDto,
    ): Promise<GlobalAlerts> {
        return this.alertsService.updateGlobalAlert(id, dto);
    }

    @Delete('global/:id')
    @ApiOperation({ summary: 'Удалить глобальное уведомление' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 204 })
    async removeGlobalAlert(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<void> {
        await this.alertsService.removeGlobalAlert(id);
    }
}
