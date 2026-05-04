// dto/update-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

export class UpdateProductDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsUUID()
    id: string;

    @ApiProperty({ example: 'Круассан', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'Свежий круассан с маслом', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 1, required: false })
    @IsInt()
    @IsOptional()
    productsCategoryId?: number;

    @ApiProperty({ example: 150.0 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price: number;
}
