// dto/update-coffee-volume.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCoffeeVolumeDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @IsNotEmpty()
    id: number;

    @ApiProperty({ example: '250ml' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
