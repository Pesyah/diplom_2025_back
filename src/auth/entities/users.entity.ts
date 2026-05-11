import { ApiProperty } from '@nestjs/swagger';
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

    @Column({ nullable: true })
    passportSeries: string; // Серия (4 цифры)

    @Column({ nullable: true })
    passportNumber: string; // Номер (6 цифр)

    @Column({ nullable: true })
    passportIssuedBy: string; // Кем выдан

    @Column({ type: 'date', nullable: true })
    passportIssueDate: Date; // Дата выдачи

    @Column({ nullable: true })
    registrationAddress: string; // Адрес регистрации

    @ApiProperty()
    @ManyToOne(() => UserRoleType)
    @JoinColumn()
    roleType: UserRoleType;

    @ApiProperty()
    @CreateDateColumn()
    created_at: Date;
}
