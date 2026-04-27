import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Producers } from './producers.entity';
import { ProductsCategory } from './products-category.entity';
import { ProductsPriceHistory } from './products-price-history.entity';

@Entity()
export class Products {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Категория
    @ManyToMany(() => ProductsCategory)
    @JoinTable({ name: 'products_and_products_category' })
    productsCategory: ProductsCategory[];

    // Что-то типа бренда или производителя
    @ManyToOne(() => Producers)
    @JoinColumn()
    producers: Producers;

    @Column({ length: 200 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ default: 0 })
    stockQuantity: number;

    @Column('simple-array', { nullable: true })
    images: string[]; // Массив URL изображений

    @OneToMany(() => ProductsPriceHistory, (history) => history.products)
    priceHistory: ProductsPriceHistory[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
