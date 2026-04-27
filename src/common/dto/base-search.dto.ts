import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class BaseSearchDto extends PaginationDto {
    @ApiProperty({ required: false, default: '' })
    @IsOptional()
    @IsString()
    search?: string;
}
