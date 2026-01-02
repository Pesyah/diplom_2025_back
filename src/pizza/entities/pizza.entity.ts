import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pizza {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    structure: string;

    @Column()
    proteins: number;

    @Column()
    fats: number;

    @Column()
    carbohydrates: number;

    @Column()
    kilocalories: number;
}
