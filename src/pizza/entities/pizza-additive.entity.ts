import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PizzaAdditive {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    avatar: string;
}
