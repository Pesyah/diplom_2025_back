import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlertsType } from 'src/alerts/entities/alerts-type.entity';
import { UserRoleType } from 'src/auth/entities/user-roles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(UserRoleType)
        private readonly userRoleTypeRepository: Repository<UserRoleType>,
        @InjectRepository(AlertsType)
        private alertsTypeRepository: Repository<AlertsType>,
    ) {
        this.runSeeds();
    }

    async runSeeds() {
        await this.userRoleType();
        await this.alertsType();
    }

    async alertsType() {
        await this.alertsTypeRepository.save([
            this.alertsTypeRepository.create({
                id: 1,
                name: 'Обычное',
                color: 'f5f5f5', // серый
            }),
            this.alertsTypeRepository.create({
                id: 2,
                name: 'Срочное',
                color: 'ffbf00', // чуть светлее цвета "яндекс"
            }),
            this.alertsTypeRepository.create({
                id: 3,
                name: 'Экстренное',
                color: 'ce2029', // алый
            }),
        ]);
    }

    async userRoleType() {
        await this.userRoleTypeRepository.save([
            this.userRoleTypeRepository.create({
                id: 1,
                name: 'user',
            }),
            this.userRoleTypeRepository.create({
                id: 2,
                name: 'admin',
            }),
        ]);
    }
}
