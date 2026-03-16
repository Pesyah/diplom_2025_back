import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RoomsType {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column('text', { nullable: true })
    description: string;
}
