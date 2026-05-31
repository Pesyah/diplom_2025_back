import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Rooms } from 'src/rooms/entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomReviewDto } from './dto/create-room-review.dto';
import { RoomReview } from './entities/room-review.entity';

@Injectable()
export class ReviewsService {
    private readonly completedReservationStatusId = 4;

    constructor(
        @InjectRepository(RoomReview)
        private readonly roomReviewRepository: Repository<RoomReview>,
        @InjectRepository(Rooms)
        private readonly roomsRepository: Repository<Rooms>,
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
    ) {}

    async findByRoom(roomId: string) {
        const room = await this.roomsRepository.findOneBy({ id: roomId });

        if (!room) {
            throw new NotFoundException('Номер не найден');
        }

        const reviews = await this.roomReviewRepository.find({
            where: { room: { id: roomId } },
            relations: {
                user: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });

        return reviews.map((review) => this.toResponse(review));
    }

    async findMy(userId: string) {
        const reviews = await this.roomReviewRepository.find({
            where: { user: { id: userId } },
            relations: {
                room: true,
                user: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });

        return reviews.map((review) => ({
            ...this.toResponse(review),
            roomId: review.room.id,
        }));
    }

    async create(dto: CreateRoomReviewDto, userId: string) {
        const room = await this.roomsRepository.findOneBy({ id: dto.roomId });

        if (!room) {
            throw new NotFoundException('Номер не найден');
        }

        const user = await this.usersRepository.findOneBy({ id: userId });

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        const text = dto.text.trim();

        if (!text) {
            throw new BadRequestException('Текст отзыва не может быть пустым');
        }

        const existingReview = await this.roomReviewRepository.findOne({
            where: {
                room: { id: room.id },
                user: { id: user.id },
            },
        });

        if (existingReview) {
            throw new BadRequestException(
                'Вы уже оставили отзыв по этому номеру',
            );
        }

        const hasCompletedReservation =
            await this.hasCompletedReservation(room.id, user.id);

        if (!hasCompletedReservation) {
            throw new ForbiddenException(
                'Отзыв можно оставить только после завершенной брони этого номера',
            );
        }

        const review = this.roomReviewRepository.create({
            room,
            user,
            text,
            rating: dto.rating,
        });

        const savedReview = await this.roomReviewRepository.save(review);
        await this.recalculateRoomRating(room.id);

        return this.toResponse({
            ...savedReview,
            room,
            user,
        });
    }

    async delete(id: string) {
        const review = await this.roomReviewRepository.findOne({
            where: { id },
            relations: {
                room: true,
                user: true,
            },
        });

        if (!review) {
            throw new NotFoundException('Отзыв не найден');
        }

        const roomId = review.room.id;
        await this.roomReviewRepository.remove(review);
        await this.recalculateRoomRating(roomId);

        return { message: 'Отзыв удален' };
    }

    private async hasCompletedReservation(roomId: string, userId: string) {
        const reservation = await this.reservationRepository
            .createQueryBuilder('reservation')
            .innerJoin('reservation.room', 'room')
            .innerJoin('reservation.reservationStatus', 'reservationStatus')
            .innerJoin('reservation.mainGuest', 'mainGuest')
            .leftJoin('reservation.guests', 'guest')
            .where('room.id = :roomId', { roomId })
            .andWhere('reservationStatus.id = :statusId', {
                statusId: this.completedReservationStatusId,
            })
            .andWhere('(mainGuest.id = :userId OR guest.id = :userId)', {
                userId,
            })
            .getOne();

        return Boolean(reservation);
    }

    private async recalculateRoomRating(roomId: string) {
        const reviews = await this.roomReviewRepository.find({
            where: { room: { id: roomId } },
            select: {
                id: true,
                rating: true,
            },
        });

        const rating =
            reviews.length === 0
                ? 0
                : Number(
                      (
                          reviews.reduce((sum, review) => sum + review.rating, 0) /
                          reviews.length
                      ).toFixed(2),
                  );

        await this.roomsRepository.update({ id: roomId }, { rating });
    }

    private toResponse(review: RoomReview) {
        return {
            id: review.id,
            text: review.text,
            rating: review.rating,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            user: {
                id: review.user.id,
                name: review.user.name,
                surname: review.user.surname,
            },
        };
    }
}
