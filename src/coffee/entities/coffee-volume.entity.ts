import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class CoffeeVolume {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;
}
