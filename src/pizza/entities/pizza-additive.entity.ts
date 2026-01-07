import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class PizzaAdditive {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    avatar: string;
}
