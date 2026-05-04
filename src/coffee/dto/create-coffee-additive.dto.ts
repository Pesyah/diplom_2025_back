// dto/create-coffee-additive.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCoffeeAdditiveDto {
    @ApiProperty({ example: 'Сахар' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'https://example.com/sugar.jpg' })
    @IsString()
    @IsNotEmpty()
    avatar: string;
}
