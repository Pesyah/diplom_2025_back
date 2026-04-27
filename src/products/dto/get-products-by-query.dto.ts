import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional } from 'class-validator';
import { BaseSearchDto } from 'src/common/dto/base-search.dto';

export class GetProductsByQueryDto extends BaseSearchDto {
    @ApiProperty({
        required: false,
        example: [1, 2],
        isArray: true,
    })
    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @Type(() => Number)
    @IsArray()
    @IsInt({ each: true })
    brandId?: number[];

    @ApiProperty({
        required: false,
        example: [2, 3],
        isArray: true,
    })
    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @Type(() => Number)
    @IsArray()
    @IsInt({ each: true })
    categoryId?: number[];
}
