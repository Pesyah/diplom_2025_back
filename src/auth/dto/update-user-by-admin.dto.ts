import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateUserByAdminDto {
    @ApiProperty({ example: 'Иван', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ example: 'Иванов', required: false })
    @IsOptional()
    @IsString()
    surname?: string;

    @ApiProperty({ example: '+79991234567', required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    // --- Паспортные данные ---
    @ApiProperty({ example: '1234', required: false })
    @IsOptional()
    @IsString()
    passportSeries?: string;

    @ApiProperty({ example: '567890', required: false })
    @IsOptional()
    @IsString()
    passportNumber?: string;

    @ApiProperty({ example: 'ОВД района Строгино г. Москвы', required: false })
    @IsOptional()
    @IsString()
    passportIssuedBy?: string;

    @ApiProperty({ example: '2020-05-15', required: false })
    @IsOptional()
    @IsDateString()
    passportIssueDate?: string;

    @ApiProperty({
        example: 'г. Москва, ул. Ленина, д. 10, кв. 5',
        required: false,
    })
    @IsOptional()
    @IsString()
    registrationAddress?: string;
}
