// assign-user-structure.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
} from 'class-validator';

export class AssignUserStructureDto {
    @ApiProperty({
        description: 'UUID пользователя',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID()
    userId: string;

    @ApiProperty({
        description: 'староста ли',
        example: true,
    })
    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    isElder?: boolean;

    @ApiProperty({
        description: 'ID группы (0 для очистки)',
        required: false,
        example: 5,
    })
    @IsOptional()
    @Transform(({ value }) => (value === 0 ? 0 : parseInt(value, 10)))
    @IsNumber()
    groupId?: number;

    @ApiProperty({
        description: 'ID кафедры (0 для очистки)',
        required: false,
        example: 2,
    })
    @IsOptional()
    @Transform(({ value }) => (value === 0 ? 0 : parseInt(value, 10)))
    @IsNumber()
    departmentId?: number;

    @ApiProperty({
        description: 'ID факультета (0 для очистки)',
        required: false,
        example: 1,
    })
    @IsOptional()
    @Transform(({ value }) => (value === 0 ? 0 : parseInt(value, 10)))
    @IsNumber()
    facultyId?: number;
}
