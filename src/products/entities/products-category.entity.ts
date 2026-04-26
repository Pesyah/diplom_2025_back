import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ProductsCategory {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    avatar: string;

    @Column({ type: 'text' })
    description: string;
}
