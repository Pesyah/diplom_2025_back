import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Faculty } from './entities/faculty.entity';
import { Groups } from './entities/group.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
    imports: [TypeOrmModule.forFeature([Groups, Department, Faculty])],
    controllers: [GroupsController],
    providers: [GroupsService],
})
export class GroupsModule {}
``;
