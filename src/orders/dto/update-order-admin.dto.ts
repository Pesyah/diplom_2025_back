// dto/update-order-admin.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID } from 'class-validator';

export class UpdateOrderAdminDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsUUID()
    id: string;

    @ApiProperty({ example: 2 })
    @IsInt()
    orderStatusId: number;
}
