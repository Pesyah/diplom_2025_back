import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { PizzaAdditive } from './pizza-additive.entity';
import { PizzaSizeRelation } from './pizza-size-relations.entity';

@Entity()
export class PizzaAdditiveRelation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // привязываем к связи пиццы и размера
    // чтобы избежать сложный проверок куда идет добавка
    // к примеру сырные бортики нельзя ставить пицца 20см
    // из примера - додо пицца
    @ManyToOne(() => PizzaSizeRelation)
    @JoinColumn()
    pizzaSizeRelation: PizzaSizeRelation;

    @ManyToOne(() => PizzaAdditive)
    @JoinColumn()
    pizzaAdditive: PizzaAdditive;

    @Column()
    isAdd: boolean;

    @Column()
    price: number;
}
