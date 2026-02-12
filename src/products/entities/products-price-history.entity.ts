import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Products } from './products.entity';

@Entity()
export class ProductsPriceHistory {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToOne(() => Products)
    @JoinColumn()
    products: Products;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @CreateDateColumn()
    createdAt: Date;
}
