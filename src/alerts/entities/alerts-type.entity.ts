import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class AlertsType {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    color: string;
}
