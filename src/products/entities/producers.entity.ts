import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Producers {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text' })
    description: string;
}
