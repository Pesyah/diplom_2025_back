// order.entity.ts
import { Users } from 'src/auth/entities/users.entity';
import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
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

    @OneToMany(() => OrdersParts, (ordersParts) => ordersParts.orders, {
        onDelete: 'CASCADE',
    })
    ordersParts: OrdersParts[];

    @ManyToOne(() => OrderStatus)
    @JoinColumn()
    orderStatus: OrderStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
