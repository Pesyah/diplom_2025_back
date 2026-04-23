import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { Department } from './entities/department.entity';
import { Faculty } from './entities/faculty.entity';
import { Groups } from './entities/group.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
    imports: [TypeOrmModule.forFeature([Groups, Department, Faculty, Users])],
    controllers: [GroupsController],
    providers: [GroupsService],
})
export class GroupsModule {}
``;
