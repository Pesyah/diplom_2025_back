// dto/update-coffee.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class UpdateCoffeeDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsUUID()
    id: string;

    @ApiProperty({ example: 'Latte', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        example: 'Классический латте с молочной пенкой',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 150.0, required: false })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @IsOptional()
    price?: number;

    @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
    @IsString()
    @IsOptional()
    avatar?: string;
}
