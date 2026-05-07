// dto/create-order-item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsUUID,
    Min,
} from 'class-validator';

export class CreateOrderItemAdminDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsUUID()
    @IsNotEmpty()
    orderId: string;

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
