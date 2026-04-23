import { Users } from 'src/auth/entities/users.entity';
import { Department } from 'src/groups/entities/department.entity';
import { Faculty } from 'src/groups/entities/faculty.entity';
import { Groups } from 'src/groups/entities/group.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AlertsType } from './alerts-type.entity';

@Entity()
export class Alerts {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => AlertsType)
    @JoinColumn()
    alertsType: AlertsType;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column('text', { array: true, default: [] })
    documents: string[];

    @ManyToOne(() => Faculty)
    @JoinColumn()
    faculty: Faculty | null;

    @ManyToOne(() => Department)
    @JoinColumn()
    department: Department | null;

    @ManyToOne(() => Groups)
    @JoinColumn()
    groups: Groups | null;

    @ManyToOne(() => Users)
    @JoinColumn()
    initiator: Users;

    @CreateDateColumn()
    created_at: Date;
}
