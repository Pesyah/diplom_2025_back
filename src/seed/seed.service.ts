import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleType } from 'src/auth/entities/user-roles.entity';
import { Users } from 'src/auth/entities/users.entity';
import { OrdersStatus } from 'src/orders/entities/orders-status.entity';
import { Producers } from 'src/products/entities/producers.entity';
import { ProductsCategory } from 'src/products/entities/products-category.entity';
import { Repository } from 'typeorm';
import { categoriesSeed } from './seed-files/categories.seed';
import { producersSeed } from './seed-files/producers.seed';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(UserRoleType)
        private readonly userRoleTypeRepository: Repository<UserRoleType>,
        @InjectRepository(Producers)
        private readonly producersRepository: Repository<Producers>,
        @InjectRepository(ProductsCategory)
        private readonly productsCategoryRepository: Repository<ProductsCategory>,
        @InjectRepository(OrdersStatus)
        private readonly ordersStatusRepository: Repository<OrdersStatus>,
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
    ) {
        this.runSeeds();
    }

    async runSeeds() {
        await this.userRoleType();
        await this.producers();
        await this.productsCategory();
        await this.ordersStatus();
        await this.baseUser();
    }

    async baseUser() {
        const existUser = await this.usersRepository.findOneBy({
            email: 'baseMail@mail.ru',
        });
        if (existUser) return;

        const baseRole = await this.userRoleTypeRepository.findOneBy({ id: 3 });
        if (!baseRole) return;
        await this.usersRepository.save(
            this.usersRepository.create({
                email: 'baseMail@mail.ru',
                name: 'baseName',
                surname: 'baseSurname',
                password:
                    '$2b$12$Uc3bPu7UG9ITKShsK5DibOpz6ZS/Eo5Vi9SS6xbjBkoqGUZe9oWYe', // string
                phone: '+79999999999',
                roleType: baseRole, // делаю его сразу админом
            }),
        );
    }

    async ordersStatus() {
        await this.ordersStatusRepository.save([
            this.ordersStatusRepository.create({
                id: 1,
                name: 'Оформлен',
                color: '#2196F3', // Синий
                description: 'Заказ оформлен, ожидает обработки',
            }),
            this.ordersStatusRepository.create({
                id: 2,
                name: 'Обработан',
                color: '#4CAF50', // Зеленый
                description: 'Заказ обработан, передан на склад',
            }),
            this.ordersStatusRepository.create({
                id: 3,
                name: 'Готов к выдаче',
                color: '#FF9800', // Оранжевый
                description: 'Заказ собран и готов к выдаче в магазине',
            }),
            this.ordersStatusRepository.create({
                id: 4,
                name: 'Выдан',
                color: '#9C27B0', // Фиолетовый
                description: 'Заказ выдан покупателю',
            }),
            this.ordersStatusRepository.create({
                id: 5,
                name: 'Отменен',
                color: '#F44336', // Красный
                description: 'Заказ отменен',
            }),
        ]);
    }

    async producers() {
        for (const producer of producersSeed) {
            const existProducer = await this.producersRepository.findOneBy({
                name: producer.name,
            });
            if (existProducer) continue;
            await this.producersRepository.save(
                this.producersRepository.create(producer),
            );
        }
    }

    async productsCategory() {
        for (const category of categoriesSeed) {
            const existCategory =
                await this.productsCategoryRepository.findOneBy({
                    name: category.name,
                });
            if (existCategory) continue;
            await this.productsCategoryRepository.save(
                this.productsCategoryRepository.create(category),
            );
        }
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
