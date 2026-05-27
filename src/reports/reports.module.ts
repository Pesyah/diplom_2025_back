import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationStatus } from 'src/reservations/entities/reservation-status.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Rooms } from 'src/rooms/entities/room.entity';
import { ReportsController } from './reports.controller';
import { ReportsPdfService } from './reports-pdf.service';
import { ReportsService } from './reports.service';

@Module({
    imports: [TypeOrmModule.forFeature([Reservation, Rooms, ReservationStatus])],
    controllers: [ReportsController],
    providers: [ReportsService, ReportsPdfService],
})
export class ReportsModule {}
