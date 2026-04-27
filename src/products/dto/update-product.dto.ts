import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export class UpdateProductDto {
    @ApiProperty({ default: 'uuid-продукта' })
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @ApiProperty({ default: 'Redmi Note 13 Pro', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ default: 'Обновлённое описание', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ default: 25999.99, required: false })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiProperty({ default: 45, required: false })
    @IsOptional()
    @IsInt()
    stockQuantity?: number;

    @ApiProperty({ default: ['https://example.com/img1.jpg'], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @ApiProperty({ default: 1, required: false })
    @IsOptional()
    @IsInt()
    producersId?: number;

    @ApiProperty({ default: [2], required: false })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    productsCategoryIds?: number[];
}
