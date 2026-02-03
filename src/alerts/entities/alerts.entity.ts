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

    @ManyToOne(() => Faculty)
    @JoinColumn()
    faculty: Faculty;

    @ManyToOne(() => Department)
    @JoinColumn()
    department: Department;

    @ManyToOne(() => Groups)
    @JoinColumn()
    groups: Groups;

    @ManyToOne(() => Users)
    @JoinColumn()
    initiator: Users;

    @CreateDateColumn()
    created_at: Date;
}
