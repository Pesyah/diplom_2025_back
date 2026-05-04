// dto/update-order-item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class UpdateOrderItemDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsUUID()
    id: string;

    @ApiProperty({ example: 3 })
    @IsInt()
    @Min(1)
    quantity: number;
}
