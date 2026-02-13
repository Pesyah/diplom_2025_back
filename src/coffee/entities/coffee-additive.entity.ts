import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class CoffeeAdditive {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;
}
