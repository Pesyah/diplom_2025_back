import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    Min,
    Validate,
} from 'class-validator';
import { IsUUIDArray } from 'src/auth/decorators/is-uuid-array';

export class UpdateReservationDto {
    @ApiProperty({
        example: 3,
        required: false,
        description: 'Количество гостей',
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    numberOfGuests?: number;

    @ApiProperty({
        example: [
            '550e8400-e29b-41d4-a716-446655440001',
            '550e8400-e29b-41d4-a716-446655440002',
        ],
        required: false,
        description: 'ID дополнительных гостей',
    })
    @IsOptional()
    @IsArray()
    @Validate(IsUUIDArray)
    guestIds?: string[];

    @ApiProperty({ example: 'Продлили проживание', required: false })
    @IsOptional()
    @IsString()
    specialRequests?: string;
}
