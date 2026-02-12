import { Products } from 'src/products/entities/products.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './orders.entity';

@Entity()
export class OrdersItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Orders, (order) => order.orderItem)
    @JoinColumn()
    orders: Orders;

    @ManyToOne(() => Products)
    @JoinColumn()
    products: Products;

    @Column('decimal', { precision: 10, scale: 2 })
    unitPrice: number; // Цена на момент заказа

    @Column('int')
    quantity: number;
}
