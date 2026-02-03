import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Faculty } from './faculty.entity';

@Entity()
export class Department {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Faculty)
    @JoinColumn()
    faculty: Faculty;
}
