import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { PizzaAdditiveRelation } from './pizza-additive-relations.entity';
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

    @OneToMany(
        () => PizzaAdditiveRelation,
        (pizzaAdditiveRelation) => pizzaAdditiveRelation.pizzaSizeRelation,
    )
    pizzaAdditiveRelation: PizzaAdditiveRelation;

    @Column()
    price: number;
}
