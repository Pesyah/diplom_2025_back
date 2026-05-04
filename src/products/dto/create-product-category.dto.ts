// dto/create-product-category.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductCategoryDto {
    @ApiProperty({ example: 'Выпечка' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
