// dto/search-users.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchUsersQueryDto {
    @ApiProperty({
        description: 'Поисковый запрос (имя, фамилия, email, телефон)',
        required: false,
        example: 'Иван',
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    query?: string;
}

export class SearchUsersByPathParams {
    @ApiProperty({ description: 'Поисковый запрос в пути', example: 'Иван' })
    @IsString()
    @IsNotEmpty()
    query: string;
}
