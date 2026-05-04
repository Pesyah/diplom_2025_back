import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductsCategory } from './product-category.entity';

@Entity()
export class Products {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ProductsCategory)
    @JoinColumn()
    productsCategory: ProductsCategory;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    price: number;

    @DeleteDateColumn()
    deleted_at: Date;
}
