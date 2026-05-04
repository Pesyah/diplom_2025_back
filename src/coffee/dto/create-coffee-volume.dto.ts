// dto/create-coffee-volume.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCoffeeVolumeDto {
    @ApiProperty({ example: '250ml' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
