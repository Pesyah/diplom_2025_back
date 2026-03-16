import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { RoomsStatus } from './room-status.entity';
import { RoomsType } from './room-type.entity';

@Entity()
export class Rooms {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    roomNumber: string;

    @ManyToOne(() => RoomsType)
    @JoinColumn()
    roomsType: RoomsType;

    @ManyToOne(() => RoomsStatus)
    @JoinColumn()
    roomsStatus: RoomsStatus;

    @Column('decimal', { precision: 10, scale: 2 })
    pricePerNight: number;

    @Column({ nullable: true })
    floor: number;

    @Column({ default: 1 })
    capacity: number;

    @Column({ default: 1 })
    bedsCount: number;

    @Column('text', { nullable: true })
    description: string;

    // TODO подумаем
    // @Column('simple-array', { nullable: true })
    // amenities: string[];

    @Column({ default: 0 })
    size: number;

    @Column({ default: false })
    hasBalcony: boolean;

    @Column({ default: false })
    beautifulView: boolean;

    @Column('simple-array', { nullable: true })
    photos: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
