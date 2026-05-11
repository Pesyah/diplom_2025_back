import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class UpdateRoomDto {
    @ApiProperty({ example: 'uuid-номера', description: 'ID номера' })
    @IsNotEmpty()
    @IsString()
    id: string;

    @ApiProperty({
        example: '101',
        description: 'Номер комнаты',
        required: false,
    })
    @IsOptional()
    @IsString()
    roomNumber?: string;

    @ApiProperty({ example: 1, description: 'ID типа номера', required: false })
    @IsOptional()
    @IsNumber()
    roomsTypeId?: number;

    @ApiProperty({
        example: 1,
        description: 'ID статуса номера',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    roomsStatusId?: number;

    @ApiProperty({
        example: 3000.0,
        description: 'Цена за ночь',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    pricePerNight?: number;

    @ApiProperty({ example: 3, description: 'Этаж', required: false })
    @IsOptional()
    @IsNumber()
    floor?: number;

    @ApiProperty({ example: 3, description: 'Вместимость', required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    capacity?: number;

    @ApiProperty({
        example: 2,
        description: 'Количество кроватей',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    bedsCount?: number;

    @ApiProperty({ example: 'Обновлённое описание', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: [1, 2, 4],
        description: 'Массив ID удобств',
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    amenityIds?: number[];

    @ApiProperty({ example: ['photo1.jpg', 'photo3.jpg'], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    photos?: string[];
}
