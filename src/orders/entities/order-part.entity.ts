import { PizzaAdditiveRelation } from 'src/pizza/entities/pizza-additive-relations.entity';
import { PizzaSizeRelation } from 'src/pizza/entities/pizza-size-relations.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './order.entity';

@Entity()
export class OrdersParts {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // нет смысла в привязке к юзеру т.к. есть привязка к заказу,
    // где есть пользователь, упрощаем логику
    @ManyToOne(() => Orders)
    @JoinColumn()
    orders: Orders;

    @ManyToOne(() => PizzaAdditiveRelation)
    @JoinColumn()
    pizzaAdditiveRelation: PizzaAdditiveRelation;

    @ManyToOne(() => PizzaSizeRelation)
    @JoinColumn()
    pizzaSizeRelation: PizzaSizeRelation;

    @Column()
    count: number;
}
