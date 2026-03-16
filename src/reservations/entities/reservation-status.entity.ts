import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ReservationStatus {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;
}
