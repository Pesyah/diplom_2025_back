import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleType } from 'src/auth/entities/user-roles.entity';
import { Users } from 'src/auth/entities/users.entity';
import { ReservationStatus } from 'src/reservations/entities/reservation-status.entity';
import { RoomsStatus } from 'src/rooms/entities/room-status.entity';
import { RoomsType } from 'src/rooms/entities/room-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(UserRoleType)
        private readonly userRoleTypeRepository: Repository<UserRoleType>,
        @InjectRepository(ReservationStatus)
        private readonly reservationStatusRepository: Repository<ReservationStatus>,
        @InjectRepository(RoomsType)
        private readonly roomsTypeRepository: Repository<RoomsType>,
        @InjectRepository(RoomsStatus)
        private readonly roomsStatusRepository: Repository<RoomsStatus>,
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
    ) {
        this.runSeeds();
    }

    async runSeeds() {
        await this.userRoleType();
        await this.reservationStatus();
        await this.roomsType();
        await this.roomsStatus();
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

    async userRoleType() {
        await this.userRoleTypeRepository.save([
            this.userRoleTypeRepository.create({
                id: 1,
                name: 'guest',
            }),
            this.userRoleTypeRepository.create({
                id: 2,
                name: 'manager',
            }),
            this.userRoleTypeRepository.create({
                id: 3,
                name: 'admin',
            }),
        ]);
    }

    async reservationStatus() {
        await this.reservationStatusRepository.save([
            this.reservationStatusRepository.create({
                id: 1,
                name: 'Ожидает подтверждения',
            }),
            this.reservationStatusRepository.create({
                id: 2,
                name: 'Подтверждено',
            }),
            this.reservationStatusRepository.create({
                id: 3,
                name: 'Заселено',
            }),
            this.reservationStatusRepository.create({
                id: 4,
                name: 'Выселено',
            }),
            this.reservationStatusRepository.create({
                id: 5,
                name: 'Отменено',
            }),
        ]);
    }

    async roomsType() {
        await this.roomsTypeRepository.save([
            this.roomsTypeRepository.create({
                id: 1,
                name: 'Стандарт',
                description: 'Одноместный номер с базовыми удобствами',
            }),
            this.roomsTypeRepository.create({
                id: 2,
                name: 'Делюкс',
                description: 'Двухместный номер повышенной комфортности',
            }),
            this.roomsTypeRepository.create({
                id: 3,
                name: 'Люкс',
                description: 'Двухкомнатный номер класса люкс с гостиной зоной',
            }),
            this.roomsTypeRepository.create({
                id: 4,
                name: 'Семейный',
                description:
                    'Просторный номер для размещения семьи до 4 человек',
            }),
        ]);
    }

    async roomsStatus() {
        await this.roomsStatusRepository.save([
            this.roomsStatusRepository.create({
                id: 1,
                name: 'Доступен',
                description: 'Номер свободен и готов к заселению',
            }),
            this.roomsStatusRepository.create({
                id: 2,
                name: 'Занят',
                description: 'В номере проживают гости',
            }),
            this.roomsStatusRepository.create({
                id: 3,
                name: 'Обслуживание',
                description: 'Номер на техническом обслуживании или ремонте',
            }),
        ]);
    }
}
