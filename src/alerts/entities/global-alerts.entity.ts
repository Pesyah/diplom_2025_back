import { Users } from 'src/auth/entities/users.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

// entity без faculty и других лишних вещей
// в планах сделать отличную логику от обычных
@Entity()
export class GlobalAlerts {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column('text', { array: true, default: [] })
    documents: string[];

    @ManyToOne(() => Users)
    @JoinColumn()
    initiator: Users;

    @CreateDateColumn()
    created_at: Date;
}
