import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteCategoryDto {
    @ApiProperty({ default: 1 })
    @IsNotEmpty()
    id: number;
}
