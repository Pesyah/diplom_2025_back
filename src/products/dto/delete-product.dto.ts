import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteProductDto {
    @ApiProperty({ default: 'uuid-продукта' })
    @IsNotEmpty()
    @IsUUID()
    id: string;
}
