// dto/alert.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateAlertDto {
    @ApiProperty({ description: 'Заголовок уведомления' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Описание (текст)' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Ссылка на документ' })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    documents: string[];

    @ApiProperty({ description: 'ID типа уведомления', required: false })
    @IsOptional()
    @IsNumber()
    alertsTypeId?: number;

    @ApiProperty({ description: 'ID факультета', required: false })
    @IsOptional()
    @IsNumber()
    facultyId?: number;

    @ApiProperty({ description: 'ID кафедры', required: false })
    @IsOptional()
    @IsNumber()
    departmentId?: number;

    @ApiProperty({ description: 'ID группы', required: false })
    @IsOptional()
    @IsNumber()
    groupId?: number;
}

export class UpdateAlertDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    documents: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    alertsTypeId?: number;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @IsNumber()
    facultyId?: number | null;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @IsNumber()
    departmentId?: number | null;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @IsNumber()
    groupId?: number | null;
}
