import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class OrderStatus {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;
}
