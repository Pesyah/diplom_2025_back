import { Users } from 'src/auth/entities/users.entity';
import {
    Column,
    CreateDateColumn,
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
    ordersItems: OrdersItems[];

    @Column('text')
    comment: string;

    @Column('decimal', { precision: 10, scale: 2 })
    totalValue: number;

    @CreateDateColumn()
    created_at: Date;
}
