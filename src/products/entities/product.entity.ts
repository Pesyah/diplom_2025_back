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

    @DeleteDateColumn()
    deleted_at: Date;
}
