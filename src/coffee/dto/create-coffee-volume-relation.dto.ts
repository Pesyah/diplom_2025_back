// dto/create-coffee-volume-relation.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateCoffeeVolumeRelationDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsUUID()
    @IsNotEmpty()
    coffeeId: string;

    @ApiProperty({ example: 2 })
    @IsNumber()
    @IsNotEmpty()
    coffeeVolumeId: number;

    @ApiProperty({ example: 200.0 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price: number;
}
