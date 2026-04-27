import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ default: 'Смартфоны' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ default: 'https://example.com/phones.png' })
    @IsNotEmpty()
    @IsString()
    avatar: string;

    @ApiProperty({ default: 'Мобильные телефоны и смартфоны' })
    @IsNotEmpty()
    @IsString()
    description: string;
}
