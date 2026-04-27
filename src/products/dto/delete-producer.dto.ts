import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteProducerDto {
    @ApiProperty({ default: 1 })
    @IsNotEmpty()
    id: number;
}
