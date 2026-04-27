import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProducerDto {
    @ApiProperty({ default: 'Xiaomi' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ default: 'Китайский производитель электроники' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ default: 'https://example.com/xiaomi.png' })
    @IsNotEmpty()
    @IsString()
    avatar: string;
}
