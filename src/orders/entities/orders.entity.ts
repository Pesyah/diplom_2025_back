import { Users } from 'src/auth/entities/users.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from './order-status.entity';
import { OrdersItems } from './orders-items.entity';

@Entity()
export class Orders {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Users)
    @JoinColumn()
    users: Users;

    @ManyToOne(() => OrderStatus)
    @JoinColumn()
    orderStatus: OrderStatus;

    @OneToMany(() => OrdersItems, (ordersItems) => ordersItems.orders)
    ordersItems: OrdersItems;

    @Column('decimal', { precision: 10, scale: 2 })
    totalValue: number;
}
