// order-part.entity.ts
import { PizzaAdditiveRelation } from 'src/pizza/entities/pizza-additive-relations.entity';
import { PizzaSizeRelation } from 'src/pizza/entities/pizza-size-relations.entity';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './order.entity';

@Entity()
export class OrdersParts {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Orders)
    @JoinColumn()
    orders: Orders;

    @ManyToMany(() => PizzaAdditiveRelation)
    @JoinTable({ name: 'orders_parts_pizza_additive_relations' })
    pizzaAdditiveRelations: PizzaAdditiveRelation[];

    @ManyToOne(() => PizzaSizeRelation)
    @JoinColumn()
    pizzaSizeRelation: PizzaSizeRelation;

    @Column()
    count: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    priceAtTime: number;
}
