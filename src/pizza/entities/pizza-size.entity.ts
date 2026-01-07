import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PizzaSize {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
}
