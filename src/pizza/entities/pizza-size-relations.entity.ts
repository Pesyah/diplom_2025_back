import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { PizzaSize } from './pizza-size.entity';
import { Pizza } from './pizza.entity';

@Entity()
export class PizzaSizeRelation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Pizza)
    @JoinColumn()
    pizza: Pizza;

    @ManyToOne(() => PizzaSize)
    @JoinColumn()
    pizzaSize: PizzaSize;

    @Column()
    price: number;
}
