import { Users } from 'src/auth/entities/users.entity';
import {
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { OrdersParts } from './order-part.entity';
import { OrderStatus } from './order-status.entity';

@Entity()
export class Orders {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Users)
    @JoinColumn()
    users: Users;

    @OneToMany(() => OrdersParts, (ordersParts) => ordersParts.orders)
    ordersParts: OrdersParts[];

    @ManyToOne(() => OrderStatus)
    @JoinColumn()
    orderStatus: OrderStatus;
}
