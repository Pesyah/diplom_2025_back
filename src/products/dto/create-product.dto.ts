// dto/create-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ example: 'Круассан' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Свежий круассан с маслом' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    @IsNotEmpty()
    productsCategoryId: number;

    @ApiProperty({ example: 150.0 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price: number;
}
