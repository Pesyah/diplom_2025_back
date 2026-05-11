// import { Injectable } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Reservation } from 'src/reservations/entities/reservation.entity';
// import { Rooms } from 'src/rooms/entities/room.entity';
// import { RoomsService } from 'src/rooms/rooms.service';
// import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

// @Injectable()
// export class CronService {
//     constructor(
//         @InjectRepository(Reservation)
//         private readonly reservationRepository: Repository<Reservation>,
//         @InjectRepository(Rooms)
//         private readonly roomsRepository: Repository<Rooms>,
//         private readonly roomsService: RoomsService,
//     ) {}

//     @Cron(CronExpression.EVERY_30_MINUTES)
//     async syncRoomStatuses() {
//         const now = new Date();

//         // 1. Все активные брони (заселены прямо сейчас)
//         const activeReservations = await this.reservationRepository.find({
//             where: {
//                 reservationStatus: { id: 3 }, // "Заселено"
//                 checkInDate: LessThanOrEqual(now),
//                 checkOutDate: MoreThanOrEqual(now),
//             },
//             relations: {
//                 room: true,
//             },
//         });

//         // 2. ID комнат, которые сейчас заняты
//         const occupiedRoomIds = activeReservations.map((r) => r.room.id);

//         // 3. Все комнаты
//         const allRooms = await this.roomsRepository.find({
//             relations: {
//                 roomsStatus: true,
//             },
//         });

//         // 4. Проходим по всем комнатам
//         for (const room of allRooms) {
//             if (room.roomsStatus.id === 3) continue; // На обслуживании — не трогаем

//             if (occupiedRoomIds.includes(room.id)) {
//                 // Есть активная бронь → должен быть "Занят"
//                 if (room.roomsStatus.id !== 2) {
//                     await this.roomsService.setRoomOccupied(room.id);
//                 }
//             } else {
//                 // Нет активной брони → должен быть "Доступен"
//                 if (room.roomsStatus.id !== 1) {
//                     await this.roomsService.setRoomAvailable(room.id);
//                 }
//             }
//         }
//     }
// }
