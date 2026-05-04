import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CoffeeAdditive } from './coffee-additive.entity';
import { CoffeeVolumeRelation } from './coffee-volume-relation.entity';

@Entity()
export class CoffeeAdditiveRelation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => CoffeeVolumeRelation)
    @JoinColumn()
    coffeeVolumeRelation: CoffeeVolumeRelation;

    @ManyToOne(() => CoffeeAdditive)
    @JoinColumn()
    coffeeAdditive: CoffeeAdditive;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
}
