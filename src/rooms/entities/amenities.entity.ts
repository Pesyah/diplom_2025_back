import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Amenities {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text', { nullable: true })
    description: string;
}
