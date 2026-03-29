import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreatePizzaSizeRelationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    pizza: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    pizzaSize: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    price: number;
}
