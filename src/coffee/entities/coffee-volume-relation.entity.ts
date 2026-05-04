import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CoffeeAdditiveRelation } from './coffee-additive-relation.entity';
import { CoffeeVolume } from './coffee-volume.entity';
import { Coffee } from './coffee.entity';

@Entity()
export class CoffeeVolumeRelation {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => CoffeeAdditiveRelation, (val) => val.coffeeVolumeRelation)
    coffeeAdditiveRelation: CoffeeAdditiveRelation;

    @ManyToOne(() => Coffee)
    @JoinColumn()
    coffee: Coffee;

    @ManyToOne(() => CoffeeVolume)
    @JoinColumn()
    coffeeVolume: CoffeeVolume;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
}
