import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ProductsCategory {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;
}
