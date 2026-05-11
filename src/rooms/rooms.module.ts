import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { Amenities } from './entities/amenities.entity';
import { RoomsStatus } from './entities/room-status.entity';
import { RoomsType } from './entities/room-type.entity';
import { Rooms } from './entities/room.entity';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([
            Rooms,
            RoomsStatus,
            RoomsType,
            Amenities,
            Users,
        ]),
        RoomsModule,
    ],
    controllers: [RoomsController],
    providers: [RoomsService],
    exports: [RoomsService],
})
export class RoomsModule {}
