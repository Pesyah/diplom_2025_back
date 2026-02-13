import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CoffeeVolume } from './coffee-volume.entity';
import { Coffee } from './coffee.entity';

@Entity()
export class CoffeeVolumeRelation {
    @PrimaryColumn()
    id: number;

    @ManyToOne(() => Coffee)
    @JoinColumn()
    coffee: Coffee;

    @ManyToOne(() => CoffeeVolume)
    @JoinColumn()
    coffeeVolume: CoffeeVolume;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
}
