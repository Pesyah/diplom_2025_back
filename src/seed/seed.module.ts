import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alerts } from 'src/alerts/entities/alerts.entity';
import { UserRoleType } from 'src/auth/entities/user-roles.entity';
import { SeedService } from './seed.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserRoleType, Alerts])],
    providers: [SeedService],
})
export class SeedModule {}
