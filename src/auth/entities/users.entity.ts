import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Users {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

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
    @CreateDateColumn()
    created_at: Date;
}
