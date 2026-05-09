import {
    Column,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CoffeeVolumeRelation } from './coffee-volume-relation.entity';

@Entity()
export class Coffee {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => CoffeeVolumeRelation, (val) => val.coffee)
    coffeeVolumeRelation: CoffeeVolumeRelation;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column()
    avatar: string;

    @DeleteDateColumn()
    deleted_at: Date;
}
