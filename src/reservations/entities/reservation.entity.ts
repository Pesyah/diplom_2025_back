import { Users } from 'src/auth/entities/users.entity';
import { Rooms } from 'src/rooms/entities/room.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ReservationStatus } from './reservation-status.entity';

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ReservationStatus)
    @JoinColumn()
    reservationStatus: ReservationStatus;

    @ManyToOne(() => Rooms)
    @JoinColumn()
    room: Rooms;

    // Основной гость (на кого оформлено бронирование)
    @ManyToOne(() => Users)
    @JoinColumn()
    mainGuest: Users;

    // Основные жители
    @ManyToMany(() => Users)
    @JoinTable({ name: 'reservation_and_users' })
    guests: Users;

    @Column()
    checkInDate: Date;

    @Column()
    checkOutDate: Date;

    @Column('decimal', { precision: 10, scale: 2 })
    totalPrice: number;

    @Column({ nullable: true })
    numberOfGuests: number;

    @Column('text', { nullable: true })
    specialRequests: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
