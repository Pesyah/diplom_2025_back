import { Users } from 'src/auth/entities/users.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { OrdersItem } from './orders-item.entity';
import { OrdersStatus } from './orders-status.entity';

@Entity()
export class Orders {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    orderNumber: string; // Формат: 000000

    @ManyToOne(() => Users)
    @JoinColumn()
    customer: Users;

    @ManyToOne(() => Users, { nullable: true })
    @JoinColumn()
    manager: Users | null;

    @ManyToOne(() => OrdersStatus)
    @JoinColumn()
    status: OrdersStatus;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'text', nullable: true })
    rejectMessage: string;

    @Column({ type: 'timestamp', nullable: true })
    finishAt: Date;

    @OneToMany(() => OrdersItem, (orderItem) => orderItem.orders, {
        cascade: true,
    })
    orderItem: OrdersItem[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
