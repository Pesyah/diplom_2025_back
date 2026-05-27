import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDateString, IsInt, IsOptional, IsUUID } from 'class-validator';

const toArray = (value: string | string[] | undefined): string[] | undefined => {
    if (value === undefined) return undefined;
    const values = Array.isArray(value) ? value : [value];
    return values.flatMap((item) => item.split(',')).filter(Boolean);
};

const toNumberArray = (
    value: string | string[] | number | number[] | undefined,
): number[] | undefined => {
    if (value === undefined) return undefined;
    const values = Array.isArray(value) ? value : [value];
    return values
        .flatMap((item) => String(item).split(','))
        .filter(Boolean)
        .map(Number);
};

export class RoomsReportQueryDto {
    @ApiPropertyOptional({
        type: [String],
        description: 'Room ids. Can be passed multiple times: roomIds=id1&roomIds=id2',
    })
    @IsOptional()
    @Transform(({ value }) => toArray(value))
    @IsArray()
    @IsUUID('4', { each: true })
    roomIds?: string[];

    @ApiPropertyOptional({
        example: '2026-01-01',
        description: 'Start date. Optional; if later than dateTo dates will be swapped.',
    })
    @IsOptional()
    @IsDateString()
    dateFrom?: string;

    @ApiPropertyOptional({
        example: '2026-03-31',
        description: 'End date. Optional; if earlier than dateFrom dates will be swapped.',
    })
    @IsOptional()
    @IsDateString()
    dateTo?: string;

    @ApiPropertyOptional({
        type: [Number],
        description:
            'Reservation status ids. By default all statuses except cancelled are used.',
    })
    @IsOptional()
    @Transform(({ value }) => toNumberArray(value))
    @IsArray()
    @IsInt({ each: true })
    statusIds?: number[];
}
