import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

// dto/update-order-status.dto.ts
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
    @IsInt()
    @IsNotEmpty()
    statusId: number;
}
