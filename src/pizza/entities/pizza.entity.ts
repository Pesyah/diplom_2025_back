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

    @Column('decimal', { precision: 4, scale: 2, nullable: true })
    proteins: number;

    @Column('decimal', { precision: 4, scale: 2, nullable: true })
    fats: number;

    @Column('decimal', { precision: 4, scale: 2, nullable: true })
    carbohydrates: number;

    @Column('decimal', { precision: 4, scale: 2, nullable: true })
    kilocalories: number;

    @Column('decimal', { precision: 8, scale: 2, nullable: true })
    kilojoules: number;

    @Column({ default: 'uploads/default-pizza.png' })
    photo: string;
}
