// dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    productsId?: string;

    @ApiProperty({ example: 5, required: false })
    @IsInt()
    @IsOptional()
    coffeeVolumeRelationId?: number;

    @ApiProperty({
        example: [1, 2, 3],
        required: false,
        type: [Number],
    })
    @IsArray()
    @IsOptional()
    coffeeAdditiveRelationIds?: number[];

    @ApiProperty({ example: 2 })
    @IsInt()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({ example: 'Без сахара пожалуйста', required: false })
    @IsString()
    @IsOptional()
    comment?: string;

    @ApiProperty({ type: [CreateOrderItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}
