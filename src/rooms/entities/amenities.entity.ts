import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Amenities {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column('text', { nullable: true })
    description: string;
}
