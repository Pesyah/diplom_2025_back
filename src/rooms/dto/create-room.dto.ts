import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class CreateRoomDto {
    @ApiProperty({ example: '101', description: 'Номер комнаты' })
    @IsNotEmpty()
    @IsString()
    roomNumber: string;

    @ApiProperty({ example: 1, description: 'ID типа номера' })
    @IsNotEmpty()
    @IsNumber()
    roomsTypeId: number;

    @ApiProperty({ example: 1, description: 'ID статуса номера' })
    @IsNotEmpty()
    @IsNumber()
    roomsStatusId: number;

    @ApiProperty({ example: 2500.0, description: 'Цена за ночь' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    pricePerNight: number;

    @ApiProperty({ example: 2, description: 'Этаж', required: false })
    @IsOptional()
    @IsNumber()
    floor?: number;

    @ApiProperty({ example: 2, description: 'Вместимость', default: 1 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    capacity?: number;

    @ApiProperty({ example: 1, description: 'Количество кроватей', default: 1 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    bedsCount?: number;

    @ApiProperty({ example: 'Уютный номер с видом на море', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: [1, 2, 3],
        description: 'Массив ID удобств',
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    amenityIds?: number[];

    @ApiProperty({ example: ['photo1.jpg', 'photo2.jpg'], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    photos?: string[];
}
