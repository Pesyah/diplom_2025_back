import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProducerDto {
    @ApiProperty({ default: 1 })
    @IsNotEmpty()
    id: number;

    @ApiProperty({ required: false, default: 'Xiaomi' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false, default: 'Описание бренда' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false, default: 'https://example.com/xiaomi.png' })
    @IsOptional()
    @IsString()
    avatar?: string;
}
