import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PizzaType } from './pizza-type.entity';

@Entity()
export class Pizza {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => PizzaType)
    pizzaType: PizzaType;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    structure: string;

    @Column()
    proteins: number;

    @Column()
    fats: number;

    @Column()
    carbohydrates: number;

    @Column()
    kilocalories: number;

    @Column()
    kilojoules: number;
}
