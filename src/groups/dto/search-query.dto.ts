import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchQueryDto {
    @ApiProperty({
        description: 'Поисковый запрос (название или код)',
        required: false,
        example: 'Информатика',
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    query?: string;
}

export class SearchByPathParams {
    @ApiProperty({
        description: 'Поисковый запрос в пути',
        example: 'Информатика',
    })
    @IsString()
    @IsNotEmpty()
    query: string;
}
