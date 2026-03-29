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

// update-pizza-size.dto.ts
import { CreatePizzaAdditiveRelationDto } from './create-pizza-additive-relation.dto';
import { CreatePizzaAdditiveDto } from './create-pizza-additive.dto';
import { CreatePizzaSizeRelationDto } from './create-pizza-size-relation.dto';
import { CreatePizzaSizeDto } from './create-pizza-size.dto';

export class UpdatePizzaSizeDto extends CreatePizzaSizeDto {}

// update-pizza-size-relation.dto.ts

export class UpdatePizzaSizeRelationDto extends CreatePizzaSizeRelationDto {}

// update-pizza-additive.dto.ts

export class UpdatePizzaAdditiveDto extends CreatePizzaAdditiveDto {}

// update-pizza-additive-relation.dto.ts

export class UpdatePizzaAdditiveRelationDto extends CreatePizzaAdditiveRelationDto {}
