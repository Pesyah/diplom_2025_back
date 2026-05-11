import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { Rooms } from 'src/rooms/entities/room.entity';
import { RoomsService } from 'src/rooms/rooms.service';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationStatus } from './entities/reservation-status.entity';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationsService {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
        @InjectRepository(ReservationStatus)
        private readonly reservationStatusRepository: Repository<ReservationStatus>,
        @InjectRepository(Rooms)
        private readonly roomsRepository: Repository<Rooms>,
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,

        private readonly roomsService: RoomsService,
    ) {}

    // ======================== GET ========================

    async findAll() {
        return this.reservationRepository.find({
            relations: {
                reservationStatus: true,
                room: {
                    roomsType: true,
                    roomsStatus: true,
                    amenities: true,
                },
                mainGuest: {
                    roleType: true,
                },
                guests: {
                    roleType: true,
                },
            },
            withDeleted: true,
        });
    }

    async findByUser(userId: string) {
        return this.reservationRepository.find({
            where: { mainGuest: { id: userId } },
            relations: {
                reservationStatus: true,
                room: {
                    roomsType: true,
                    roomsStatus: true,
                    amenities: true,
                },
                mainGuest: {
                    roleType: true,
                },
                guests: {
                    roleType: true,
                },
            },
            withDeleted: true,
        });
    }

    async findById(id: string, userId?: string) {
        const reservation = await this.reservationRepository.findOne({
            where: { id },
            relations: {
                reservationStatus: true,
                room: {
                    roomsType: true,
                    roomsStatus: true,
                    amenities: true,
                },
                mainGuest: {
                    roleType: true,
                },
                guests: {
                    roleType: true,
                },
            },
            withDeleted: true,
        });

        if (!reservation) {
            throw new NotFoundException('Бронирование не найдено');
        }

        // Если передан userId — проверяем, что это бронь этого пользователя
        if (userId && reservation.mainGuest.id !== userId) {
            throw new ForbiddenException('Это не ваше бронирование');
        }

        return reservation;
    }

    // ======================== CREATE ========================

    async create(dto: CreateReservationDto, userId: string) {
        const checkIn = new Date(dto.checkInDate);
        const checkOut = new Date(dto.checkOutDate);

        if (checkOut <= checkIn) {
            throw new BadRequestException(
                'Дата выезда должна быть позже даты заезда',
            );
        }

        const room = await this.roomsRepository.findOne({
            where: { id: dto.roomId },
            relations: {
                roomsType: true,
                roomsStatus: true,
                amenities: true,
            },
        });

        if (!room) {
            throw new NotFoundException('Номер не найден');
        }

        if (room.roomsStatus.id === 3) {
            throw new BadRequestException('Номер находится на обслуживании');
        }

        if (dto.numberOfGuests > room.capacity) {
            throw new BadRequestException(
                `Вместимость номера: ${room.capacity}. Нельзя заселить ${dto.numberOfGuests} гостей`,
            );
        }

        // Проверка на пересечение дат с активными бронями
        const conflictingReservation = await this.reservationRepository.findOne(
            {
                where: {
                    room: { id: room.id },
                    reservationStatus: { id: In([1, 2, 3]) },
                    checkInDate: LessThanOrEqual(checkOut),
                    checkOutDate: MoreThanOrEqual(checkIn),
                },
            },
        );

        if (conflictingReservation) {
            throw new BadRequestException('Номер занят в выбранные даты');
        }

        const mainGuest = await this.usersRepository.findOneBy({ id: userId });
        if (!mainGuest) {
            throw new NotFoundException('Пользователь не найден');
        }

        let guests: Users[] = [];
        if (dto.guestIds && dto.guestIds.length > 0) {
            guests = await this.usersRepository.findBy({
                id: In(dto.guestIds),
            });
        }

        const pendingStatus =
            await this.reservationStatusRepository.findOneByOrFail({ id: 1 });

        const nights = Math.ceil(
            (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
        );
        const totalPrice = room.pricePerNight * nights;

        const reservation = this.reservationRepository.create({
            room,
            mainGuest,
            guests,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            numberOfGuests: dto.numberOfGuests,
            totalPrice,
            specialRequests: dto.specialRequests,
            reservationStatus: pendingStatus,
        });

        return this.reservationRepository.save(reservation);
    }

    // ======================== ДЕЙСТВИЯ СО СТАТУСАМИ ========================

    async confirm(id: string) {
        const reservation = await this.findById(id);
        const confirmedStatus =
            await this.reservationStatusRepository.findOneByOrFail({ id: 2 });
        reservation.reservationStatus = confirmedStatus;
        return this.reservationRepository.save(reservation);
    }

    async checkIn(id: string) {
        const reservation = await this.findById(id);

        if (reservation.reservationStatus.id !== 2) {
            throw new BadRequestException(
                'Бронирование должно быть подтверждено перед заселением',
            );
        }

        const checkedInStatus =
            await this.reservationStatusRepository.findOneByOrFail({ id: 3 });
        reservation.reservationStatus = checkedInStatus;

        await this.reservationRepository.save(reservation);

        // Меняем статус номера на "Занят"
        await this.roomsService.setRoomOccupied(reservation.room.id);

        return reservation;
    }

    async checkOut(id: string) {
        const reservation = await this.findById(id);

        if (reservation.reservationStatus.id !== 3) {
            throw new BadRequestException(
                'Бронирование должно быть в статусе "Заселено" для выселения',
            );
        }

        const checkedOutStatus =
            await this.reservationStatusRepository.findOneByOrFail({ id: 4 });
        reservation.reservationStatus = checkedOutStatus;

        await this.reservationRepository.save(reservation);

        // Меняем статус номера на "Доступен"
        await this.roomsService.setRoomAvailable(reservation.room.id);

        return reservation;
    }

    async cancel(id: string, dto: CancelReservationDto, userId?: string) {
        const reservation = await this.findById(id, userId);

        if (reservation.reservationStatus.id === 4) {
            throw new BadRequestException(
                'Нельзя отменить уже выселенное бронирование',
            );
        }

        if (reservation.reservationStatus.id === 5) {
            throw new BadRequestException('Бронирование уже отменено');
        }

        const wasCheckedIn = reservation.reservationStatus.id === 3;

        const cancelledStatus =
            await this.reservationStatusRepository.findOneByOrFail({ id: 5 });
        reservation.reservationStatus = cancelledStatus;
        reservation.cancellationReason = dto.cancellationReason;

        await this.reservationRepository.save(reservation);

        // Освобождаем номер, если были заселены
        if (wasCheckedIn) {
            await this.roomsService.setRoomAvailable(reservation.room.id);
        }

        return reservation;
    }

    async update(id: string, dto: UpdateReservationDto) {
        const reservation = await this.findById(id);

        if (dto.numberOfGuests !== undefined) {
            if (dto.numberOfGuests > reservation.room.capacity) {
                throw new BadRequestException(
                    `Вместимость номера: ${reservation.room.capacity}. Нельзя заселить ${dto.numberOfGuests} гостей`,
                );
            }
            reservation.numberOfGuests = dto.numberOfGuests;
        }

        if (dto.guestIds !== undefined) {
            const guests = await this.usersRepository.findBy({
                id: In(dto.guestIds),
            });
            reservation.guests = guests;
        }

        if (dto.specialRequests !== undefined) {
            reservation.specialRequests = dto.specialRequests;
        }

        return this.reservationRepository.save(reservation);
    }
}
