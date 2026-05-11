import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CancelReservationDto {
    @ApiProperty({
        example: 'Гость передумал',
        description: 'Причина отмены бронирования',
    })
    @IsNotEmpty()
    @IsString()
    cancellationReason: string;
}
