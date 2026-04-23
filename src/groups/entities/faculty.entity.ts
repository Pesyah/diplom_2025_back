import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Faculty {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    shortName: string;
}
