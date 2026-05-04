// dto/create-order-item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsUUID, Min } from 'class-validator';

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

    @ApiProperty({ example: 3, required: false })
    @IsInt()
    @IsOptional()
    coffeeAdditiveRelationId?: number;

    @ApiProperty({ example: 2 })
    @IsInt()
    @Min(1)
    quantity: number;
}
