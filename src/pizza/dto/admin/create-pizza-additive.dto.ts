import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePizzaAdditiveDto {
    @ApiProperty({ example: '35' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'public/photo' })
    @IsNotEmpty()
    @IsString()
    avatar: string;
}
