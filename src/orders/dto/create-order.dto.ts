// dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsInt,
    IsNotEmpty,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator';

class OrderItemDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    pizzaSizeRelationId: string;

    @ApiProperty()
    @IsArray()
    @IsUUID('4', { each: true })
    additiveIds: string[];

    @ApiProperty()
    @IsInt()
    @Min(1)
    count: number;
}

export class CreateOrderDto {
    @ApiProperty({ type: OrderItemDto, isArray: true })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}
