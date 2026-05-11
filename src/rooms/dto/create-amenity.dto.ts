import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAmenityDto {
    @ApiProperty({ example: 'Холодильник', description: 'Название удобства' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Мини-холодильник в номере', required: false })
    @IsOptional()
    @IsString()
    description?: string;
}
