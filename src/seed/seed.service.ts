import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlertsType } from 'src/alerts/entities/alerts-type.entity';
import { UserRoleType } from 'src/auth/entities/user-roles.entity';
import { Users } from 'src/auth/entities/users.entity';
import { Department } from 'src/groups/entities/department.entity';
import { Faculty } from 'src/groups/entities/faculty.entity';
import { Groups } from 'src/groups/entities/group.entity';
import { Repository } from 'typeorm';
import { seedData } from './seed-files/structure';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(UserRoleType)
        private readonly userRoleTypeRepository: Repository<UserRoleType>,
        @InjectRepository(AlertsType)
        private alertsTypeRepository: Repository<AlertsType>,
        @InjectRepository(Department)
        private departmentRepository: Repository<Department>,
        @InjectRepository(Faculty)
        private facultyRepository: Repository<Faculty>,
        @InjectRepository(Groups)
        private groupsRepository: Repository<Groups>,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) {
        this.runSeeds();
    }

    async runSeeds() {
        await this.userRoleType();
        await this.alertsType();
        await this.seedFaculties();
        await this.seedDepartments();
        await this.seedGroups();
        await this.baseUser();
    }

    async baseUser() {
        const existUser = await this.usersRepository.findOneBy({
            email: 'baseMail@mail.ru',
        });
        if (existUser) return;

        const baseRole = await this.userRoleTypeRepository.findOneBy({ id: 2 });
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

    async seedFaculties() {
        const faculties = seedData.faculties.map((item) =>
            this.facultyRepository.create({
                id: item.id,
                name: item.name,
                shortName: item.shortName,
            }),
        );
        await this.facultyRepository.save(faculties);
    }

    async seedDepartments() {
        const departments = seedData.departments.map((item) => {
            const department = this.departmentRepository.create({
                id: item.id,
                name: item.name,
            });
            // Устанавливаем связь с факультетом через объект с id
            if (item.facultyId !== null) {
                department.faculty = { id: item.facultyId } as Faculty;
            }
            return department;
        });
        await this.departmentRepository.save(departments);
    }

    async seedGroups() {
        const groups = seedData.specialities.map((item, index) =>
            this.groupsRepository.create({
                id: index + 1, // Генерация id, так как автоинкремента нет
                name: item.name,
                groupCode: item.groupCode,
                department: { id: item.departmentId } as Department,
            }),
        );
        await this.groupsRepository.save(groups);
    }

    async alertsType() {
        await this.alertsTypeRepository.save([
            this.alertsTypeRepository.create({
                id: 1,
                name: 'Обычное',
                color: '83d2de', // серый
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
