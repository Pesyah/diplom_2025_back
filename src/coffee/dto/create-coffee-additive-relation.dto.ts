// dto/create-coffee-additive-relation.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCoffeeAdditiveRelationDto {
    @ApiProperty({ example: 5 })
    @IsInt()
    @IsNotEmpty()
    coffeeVolumeRelationId: number;

    @ApiProperty({ example: 3 })
    @IsInt()
    @IsNotEmpty()
    coffeeAdditiveId: number;

    @ApiProperty({ example: 30.0 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price: number;
}
