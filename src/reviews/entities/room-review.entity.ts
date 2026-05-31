import { Users } from 'src/auth/entities/users.entity';
import { Rooms } from 'src/rooms/entities/room.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['room', 'user'])
export class RoomReview {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Rooms, { onDelete: 'CASCADE' })
    @JoinColumn()
    room: Rooms;

    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: Users;

    @Column('text')
    text: string;

    @Column()
    rating: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
