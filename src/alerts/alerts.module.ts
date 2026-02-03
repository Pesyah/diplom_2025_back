import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { AlertsType } from './entities/alerts-type.entity';
import { Alerts } from './entities/alerts.entity';
import { GlobalAlerts } from './entities/global-alerts.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Alerts, AlertsType, GlobalAlerts])],
    controllers: [AlertsController],
    providers: [AlertsService],
})
export class AlertsModule {}
