import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAmenityDto {
    @ApiProperty({ example: 1, description: 'ID удобства' })
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiProperty({ example: 'Холодильник', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        example: 'Большой холодильник с морозилкой',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;
}
