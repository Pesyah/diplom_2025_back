import { CoffeeAdditiveRelation } from 'src/coffee/entities/coffee-additive-relation.entity';
import { CoffeeVolumeRelation } from 'src/coffee/entities/coffee-volume-relation.entity';
import { Coffee } from 'src/coffee/entities/coffee.entity';
import { Products } from 'src/products/entities/product.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './orders.entity';

@Entity()
export class OrdersItems {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Orders)
    @JoinColumn()
    orders: Orders;

    @ManyToOne(() => Products)
    @JoinColumn()
    products: Products;

    @ManyToOne(() => Coffee)
    @JoinColumn()
    coffee: Coffee;

    @ManyToOne(() => CoffeeAdditiveRelation)
    @JoinColumn()
    coffeeAdditiveRelation: CoffeeAdditiveRelation;

    @ManyToOne(() => CoffeeVolumeRelation)
    @JoinColumn()
    coffeeVolumeRelation: CoffeeVolumeRelation;

    @Column('decimal', { precision: 10, scale: 2 })
    totalValue: number;
}
