import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Producers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column()
    avatar: string;
}
