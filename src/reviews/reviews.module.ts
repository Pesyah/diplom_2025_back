import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Rooms } from 'src/rooms/entities/room.entity';
import { RoomReview } from './entities/room-review.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
    imports: [TypeOrmModule.forFeature([RoomReview, Rooms, Users, Reservation])],
    controllers: [ReviewsController],
    providers: [ReviewsService],
})
export class ReviewsModule {}
