import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
    @ApiProperty({ default: 1 })
    @IsNotEmpty()
    id: number;

    @ApiProperty({ required: false, default: 'Смартфоны' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false, default: 'https://example.com/phones.png' })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiProperty({ required: false, default: 'Описание категории' })
    @IsOptional()
    @IsString()
    description?: string;
}
