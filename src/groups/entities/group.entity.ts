import { Users } from 'src/auth/entities/users.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';
import { Department } from './department.entity';

@Entity()
export class Groups {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    groupCode: string;

    @ManyToOne(() => Department)
    @JoinColumn()
    department: Department;

    // запишем старосту, чтобы он тоже мог делать объявления
    @ManyToOne(() => Users)
    @JoinColumn()
    groupLeader: Users | null;

    @OneToMany(() => Users, (user) => user.group)
    groupMembers: Users;
}
