import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { Rooms } from 'src/rooms/entities/room.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
// import { CronService } from './cron.service';
import { ReservationStatus } from './entities/reservation-status.entity';
import { Reservation } from './entities/reservation.entity';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([
            ReservationStatus,
            Rooms,
            Reservation,
            Users,
        ]),
        RoomsModule,
    ],
    controllers: [ReservationsController],
    providers: [ReservationsService],
})
export class ReservationsModule {}
