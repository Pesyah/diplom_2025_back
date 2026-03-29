import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsUUID,
} from 'class-validator';

export class CreatePizzaAdditiveRelationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    pizzaSizeRelation: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    pizzaAdditive: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    isAdd: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    price: number;
}
