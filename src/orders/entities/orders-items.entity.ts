import { CoffeeAdditiveRelation } from 'src/coffee/entities/coffee-additive-relation.entity';
import { CoffeeVolumeRelation } from 'src/coffee/entities/coffee-volume-relation.entity';
import { Products } from 'src/products/entities/product.entity';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
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

    @ManyToMany(() => CoffeeAdditiveRelation)
    @JoinTable({ name: 'orders_items_and_coffee_additive_relation' })
    coffeeAdditiveRelation: CoffeeAdditiveRelation[];

    @ManyToOne(() => CoffeeVolumeRelation)
    @JoinColumn()
    coffeeVolumeRelation: CoffeeVolumeRelation;

    @Column()
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalValue: number;
}
