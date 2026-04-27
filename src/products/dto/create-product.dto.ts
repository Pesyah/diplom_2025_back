import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ default: 'Redmi Note 13 Pro' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ default: 'Смартфон среднего класса...', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ default: 29999.99 })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ default: 50 })
    @IsOptional()
    @IsInt()
    @Min(0)
    stockQuantity?: number;

    @ApiProperty({ default: ['https://example.com/img1.jpg'], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @ApiProperty({ default: 1 })
    @IsNotEmpty()
    @IsInt()
    producersId: number;

    @ApiProperty({ default: [2] })
    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    productsCategoryIds: number[];
}
