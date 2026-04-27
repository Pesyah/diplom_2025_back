import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
    productId: string;

    @ApiProperty({ example: 'iPhone 15 Pro' })
    productName: string;

    @ApiProperty({ example: 999.99 })
    unitPrice: number;

    @ApiProperty({ example: 2 })
    quantity: number;

    @ApiProperty({ example: 1999.98 })
    total: number;
}
