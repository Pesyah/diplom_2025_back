// dto/create-order.dto.ts
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
    @IsUUID()
    @IsNotEmpty()
    pizzaSizeRelationId: string;

    @IsArray()
    @IsUUID('4', { each: true })
    additiveIds: string[];

    @IsInt()
    @Min(1)
    count: number;
}

export class CreateOrderDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}
