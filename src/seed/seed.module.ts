import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleType } from 'src/auth/entities/user-roles.entity';
import { Users } from 'src/auth/entities/users.entity';
import { ReservationStatus } from 'src/reservations/entities/reservation-status.entity';
import { RoomsStatus } from 'src/rooms/entities/room-status.entity';
import { RoomsType } from 'src/rooms/entities/room-type.entity';
import { SeedService } from './seed.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserRoleType,
            ReservationStatus,
            RoomsType,
            RoomsStatus,
            Users,
        ]),
    ],
    providers: [SeedService],
})
export class SeedModule {}
