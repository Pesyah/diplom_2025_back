import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleType } from 'src/auth/entities/user-roles.entity';
import { OrderStatus } from 'src/orders/entities/order-status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(UserRoleType)
        private readonly userRoleTypeRepository: Repository<UserRoleType>,
        @InjectRepository(OrderStatus)
        private readonly orderStatusRepository: Repository<OrderStatus>,
    ) {
        this.runSeeds();
    }

    async runSeeds() {
        await this.userRoleType();
        await this.orderStatus();
    }

    async orderStatus() {
        await this.orderStatusRepository.save([
            this.orderStatusRepository.create({
                id: 1,
                name: 'Создан',
            }),
            this.orderStatusRepository.create({
                id: 2,
                name: 'В работе',
            }),
            this.orderStatusRepository.create({
                id: 3,
                name: 'Готов к выдаче',
            }),
            this.orderStatusRepository.create({
                id: 4,
                name: 'Завершен',
            }),
            this.orderStatusRepository.create({
                id: 5,
                name: 'Отклонен',
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
            this.userRoleTypeRepository.create({
                id: 3,
                name: 'moderator',
            }),
        ]);
    }
}
