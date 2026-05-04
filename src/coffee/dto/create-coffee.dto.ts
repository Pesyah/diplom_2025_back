// dto/create-coffee.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCoffeeDto {
    @ApiProperty({ example: 'Latte' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Классический латте с молочной пенкой' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 150.0 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price: number;

    @ApiProperty({ example: 'https://example.com/avatar.jpg' })
    @IsString()
    @IsNotEmpty()
    avatar: string;
}
