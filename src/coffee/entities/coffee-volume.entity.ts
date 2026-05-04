import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CoffeeVolume {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
