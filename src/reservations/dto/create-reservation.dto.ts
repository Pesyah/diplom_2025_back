import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsUUID,
    Min,
    Validate,
} from 'class-validator';
import { IsUUIDArray } from 'src/auth/decorators/is-uuid-array';

export class CreateReservationDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'ID номера',
    })
    @IsNotEmpty()
    @IsUUID()
    roomId: string;

    @ApiProperty({ example: '2026-06-01', description: 'Дата заезда' })
    @IsNotEmpty()
    @IsDateString()
    checkInDate: string;

    @ApiProperty({ example: '2026-06-05', description: 'Дата выезда' })
    @IsNotEmpty()
    @IsDateString()
    checkOutDate: string;

    @ApiProperty({ example: 2, description: 'Количество гостей' })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    numberOfGuests: number;

    @ApiProperty({
        example: ['550e8400-e29b-41d4-a716-446655440001'],
        required: false,
        description: 'ID дополнительных гостей',
    })
    @IsOptional()
    @IsArray()
    @Validate(IsUUIDArray)
    guestIds?: string[];

    @ApiProperty({
        example: 'Пожалуйста, подготовьте детскую кроватку',
        required: false,
    })
    @IsOptional()
    specialRequests?: string;
}
