import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePizzaDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    pizzaType: any;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: 'Тесто, соус, помидоры, колбаса' })
    @IsNotEmpty()
    @IsString()
    structure: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    proteins: number;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    fats: number;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    carbohydrates: number;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    kilocalories: number;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    kilojoules: number;
}
