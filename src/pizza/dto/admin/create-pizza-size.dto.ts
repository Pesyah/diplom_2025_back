import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePizzaSizeDto {
    @ApiProperty({ example: '35' })
    @IsNotEmpty()
    @IsString()
    name: string;
}
