// dto/create-coffee.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCoffeeDto {
    @ApiProperty({ example: 'Latte' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Классический латте с молочной пенкой' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 'https://example.com/avatar.jpg' })
    @IsString()
    @IsNotEmpty()
    avatar: string;
}
