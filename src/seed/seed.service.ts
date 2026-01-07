import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleType } from 'src/auth/entities/user-roles.entity';
import { OrderStatus } from 'src/orders/entities/order-status.entity';
import { PizzaType } from 'src/pizza/entities/pizza-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(OrderStatus)
        private readonly orderStatusRepository: Repository<OrderStatus>,
        @InjectRepository(PizzaType)
        private readonly pizzaTypeRepository: Repository<PizzaType>,
        @InjectRepository(UserRoleType)
        private readonly userRoleTypeRepository: Repository<UserRoleType>,
    ) {
        this.runSeeds();
    }

    async runSeeds() {
        await this.productCategory();
        await this.orderStatus();
        await this.userRoleType();
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

    async productCategory() {
        await this.pizzaTypeRepository.save([
            this.pizzaTypeRepository.create({
                id: 1,
                name: 'Веганская',
                color: '19ff19',
            }),
            this.pizzaTypeRepository.create({
                id: 2,
                name: 'Острая',
                color: '900020',
            }),
            this.pizzaTypeRepository.create({
                id: 3,
                name: 'Очень острая',
                color: '660000',
            }),
            this.pizzaTypeRepository.create({
                id: 4,
                name: 'Сезонная',
                color: '1047c7',
            }),
        ]);
    }

    async orderStatus() {
        await this.orderStatusRepository.save([
            this.orderStatusRepository.create({
                id: 1,
                name: 'Создан',
            }),
            this.orderStatusRepository.create({
                id: 2,
                name: 'Готовим',
            }),
            this.orderStatusRepository.create({
                id: 3,
                name: 'Готов к выдаче',
            }),
        ]);
    }
}
