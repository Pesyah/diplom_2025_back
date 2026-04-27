import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateOrderStatusDto {
    @ApiProperty({ example: 2 })
    @IsInt()
    @Min(1)
    @Max(5)
    statusId: number;

    @ApiProperty({ required: false, example: 'Товар закончился на складе' })
    @IsOptional()
    @IsString()
    rejectMessage?: string;
}
