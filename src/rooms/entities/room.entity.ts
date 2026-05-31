import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Amenities } from './amenities.entity';
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

    @Column('float', { default: 0 })
    rating: number;

    @Column({ nullable: true })
    floor: number;

    @Column({ default: 1 })
    capacity: number;

    @Column({ default: 1 })
    bedsCount: number;

    @Column('text', { nullable: true })
    description: string;

    @ManyToMany(() => Amenities)
    @JoinTable({ name: 'rooms_and_amenities' })
    amenities: Amenities[];

    @Column('simple-array', { nullable: true })
    photos: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deleted_at!: Date;
}
