import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Orders } from './orders.entity';

@Entity()
export class OrdersStatus {
    @PrimaryColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToMany(() => Orders, (orders) => orders.status)
    orders: Orders[];
}
