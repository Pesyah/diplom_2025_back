import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsType } from 'src/alerts/entities/alerts-type.entity';
import { Alerts } from 'src/alerts/entities/alerts.entity';
import { UserRoleType } from 'src/auth/entities/user-roles.entity';
import { Users } from 'src/auth/entities/users.entity';
import { Department } from 'src/groups/entities/department.entity';
import { Faculty } from 'src/groups/entities/faculty.entity';
import { Groups } from 'src/groups/entities/group.entity';
import { SeedService } from './seed.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserRoleType,
            Alerts,
            AlertsType,
            Groups,
            Faculty,
            Department,
            Users,
        ]),
    ],
    providers: [SeedService],
})
export class SeedModule {}
