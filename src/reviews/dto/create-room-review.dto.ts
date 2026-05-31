import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsString,
    IsUUID,
    Max,
    Min,
} from 'class-validator';

export class CreateRoomReviewDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'ID номера',
    })
    @IsNotEmpty()
    @IsUUID()
    roomId: string;

    @ApiProperty({ example: 5, description: 'Оценка от 1 до 5' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({
        example: 'Чистый номер, удобная кровать, заселили быстро.',
        description: 'Текст отзыва',
    })
    @IsNotEmpty()
    @IsString()
    text: string;
}
