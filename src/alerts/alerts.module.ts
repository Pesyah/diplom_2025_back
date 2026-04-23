import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { Department } from 'src/groups/entities/department.entity';
import { Faculty } from 'src/groups/entities/faculty.entity';
import { Groups } from 'src/groups/entities/group.entity';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { AlertsType } from './entities/alerts-type.entity';
import { Alerts } from './entities/alerts.entity';
import { GlobalAlerts } from './entities/global-alerts.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Alerts,
            AlertsType,
            GlobalAlerts,
            Faculty,
            Department,
            Groups,
            Users,
        ]),
    ],
    controllers: [AlertsController],
    providers: [AlertsService],
})
export class AlertsModule {}
