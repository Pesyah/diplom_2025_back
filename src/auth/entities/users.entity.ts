import { ApiProperty } from '@nestjs/swagger';
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
import { UserRoleType } from './user-roles.entity';

@Entity()
export class Users {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Groups, { nullable: true })
    @JoinColumn()
    group: Groups | null;

    @ManyToOne(() => Department, { nullable: true })
    @JoinColumn()
    department: Department | null;

    @ManyToOne(() => Faculty, { nullable: true })
    @JoinColumn()
    faculty: Faculty | null;

    @Column({ default: false })
    isElder: boolean;

    @Column({ select: false })
    password: string;

    @ApiProperty()
    @Column({ unique: true })
    email: string;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    surname: string;

    @ApiProperty()
    @Column()
    phone: string;

    @ApiProperty()
    @ManyToOne(() => UserRoleType)
    @JoinColumn()
    roleType: UserRoleType;

    @ApiProperty()
    @CreateDateColumn()
    created_at: Date;
}
