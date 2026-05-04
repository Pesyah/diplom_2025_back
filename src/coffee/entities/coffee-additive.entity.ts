import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CoffeeAdditive {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    avatar: string;
}
