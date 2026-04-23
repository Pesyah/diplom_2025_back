// dto/alert-query.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Alerts } from '../entities/alerts.entity';

export class AlertQueryDto {
    @ApiProperty({
        description: 'Страница (начиная с 1)',
        required: false,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiProperty({
        description: 'Количество элементов на странице (1-100)',
        required: false,
        default: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;
}

export class PaginatedAlertsResponseDto {
    @ApiProperty({ type: [Alerts] }) // Укажите тип, когда будет сущность Alert
    data: Alerts[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    totalPages: number;
}
