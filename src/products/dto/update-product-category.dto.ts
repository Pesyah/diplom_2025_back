// dto/update-product-category.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductCategoryDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @IsNotEmpty()
    id: number;

    @ApiProperty({ example: 'Выпечка' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
