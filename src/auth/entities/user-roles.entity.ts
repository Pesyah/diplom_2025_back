import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserRoleType {
    @ApiProperty()
    @PrimaryColumn()
    id: number;

    @ApiProperty()
    @Column({ unique: true })
    name: string;
}
