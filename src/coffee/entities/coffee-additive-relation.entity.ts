import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CoffeeAdditive } from './coffee-additive.entity';
import { Coffee } from './coffee.entity';

@Entity()
export class CoffeeAdditiveRelation {
    @PrimaryColumn()
    id: number;

    @ManyToOne(() => Coffee)
    @JoinColumn()
    coffee: Coffee;

    @ManyToOne(() => CoffeeAdditive)
    @JoinColumn()
    coffeeAdditive: CoffeeAdditive;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
}
