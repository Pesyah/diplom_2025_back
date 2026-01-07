import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class PizzaType {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    // Должен быть HEX формат
    @Column()
    color: string;
}
