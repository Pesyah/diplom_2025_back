import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { PizzaSizeRelation } from './pizza-size-relations.entity';
import { PizzaType } from './pizza-type.entity';

@Entity()
export class Pizza {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => PizzaType)
    @JoinColumn()
    pizzaType: PizzaType;

    @OneToMany(
        () => PizzaSizeRelation,
        (pizzaSizeRelation) => pizzaSizeRelation.pizza,
    )
    pizzaSizeRelation: PizzaSizeRelation;

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
