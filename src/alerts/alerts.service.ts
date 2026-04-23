// alerts.service.ts
import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../auth/entities/users.entity';
import { Department } from '../groups/entities/department.entity';
import { Faculty } from '../groups/entities/faculty.entity';
import { Groups } from '../groups/entities/group.entity';
import { CreateAlertDto, UpdateAlertDto } from './dto/create-alert.dto';
import {
    CreateGlobalAlertDto,
    UpdateGlobalAlertDto,
} from './dto/global-alert.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AlertsType } from './entities/alerts-type.entity';
import { Alerts } from './entities/alerts.entity';
import { GlobalAlerts } from './entities/global-alerts.entity';

@Injectable()
export class AlertsService {
    constructor(
        @InjectRepository(Alerts)
        private alertsRepository: Repository<Alerts>,
        @InjectRepository(GlobalAlerts)
        private globalAlertsRepository: Repository<GlobalAlerts>,
        @InjectRepository(AlertsType)
        private alertsTypeRepository: Repository<AlertsType>,
        @InjectRepository(Faculty)
        private facultyRepository: Repository<Faculty>,
        @InjectRepository(Department)
        private departmentRepository: Repository<Department>,
        @InjectRepository(Groups)
        private groupsRepository: Repository<Groups>,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) {}

    // ==================== ALERTS ====================
    async createAlert(dto: CreateAlertDto, user: Users): Promise<Alerts> {
        const alert = new Alerts();
        alert.title = dto.title;
        alert.description = dto.description;
        alert.documents = dto.documents;

        const initiator = await this.usersRepository.findOne({
            where: {
                id: user.id,
            },
            relations: { group: { groupLeader: true }, roleType: true },
        });
        if (!initiator) throw new NotFoundException('Инициатор не найден');

        if (initiator.roleType.id === 1) {
            if (!initiator.group)
                throw new NotFoundException('не найдена группа');
            if (!initiator.group.groupLeader)
                throw new NotFoundException('не найден староста группы');
            if (initiator.group.groupLeader.id !== initiator.id) {
                throw new ConflictException('пользователь не староста группы');
            }
            if (
                dto.facultyId ||
                dto.departmentId ||
                dto.groupId !== initiator.group.id
            )
                throw new BadRequestException(
                    'староста может делать уведомление только для своей группы',
                );
            alert.initiator = initiator;
        } else {
            alert.initiator = initiator;
        }

        // Проверка и установка связей
        if (dto.alertsTypeId) {
            const type = await this.alertsTypeRepository.findOneBy({
                id: dto.alertsTypeId,
            });
            if (!type) throw new NotFoundException('Тип уведомления не найден');
            alert.alertsType = type;
        }

        if (dto.facultyId) {
            const faculty = await this.facultyRepository.findOneBy({
                id: dto.facultyId,
            });
            if (!faculty) throw new NotFoundException('Факультет не найден');
            alert.faculty = faculty;
        }

        if (dto.departmentId) {
            const department = await this.departmentRepository.findOneBy({
                id: dto.departmentId,
            });
            if (!department) throw new NotFoundException('Кафедра не найдена');
            alert.department = department;
        }

        if (dto.groupId) {
            const group = await this.groupsRepository.findOneBy({
                id: dto.groupId,
            });
            if (!group) throw new NotFoundException('Группа не найдена');
            alert.groups = group;
        }

        alert.initiator = initiator;

        return this.alertsRepository.save(alert);
    }

    async findAllAlerts(
        pagination: PaginationDto,
        user: Users,
    ): Promise<{ data: Alerts[]; total: number }> {
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;
        const existUser = await this.usersRepository.findOne({
            where: { id: user.id },
            relations: {
                faculty: true,
                department: true,
                group: true,
                roleType: true,
            },
        });
        if (!existUser)
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);

        let where;
        if (existUser.roleType.id === 1) {
            if (!existUser.faculty || !existUser.department || !existUser.group)
                throw new HttpException(
                    'need to defined faculty | department and group ',
                    HttpStatus.CONFLICT,
                );
            else {
                where = [
                    {
                        faculty: {
                            id: existUser.faculty.id,
                        },
                    },
                    {
                        department: {
                            id: existUser.department.id,
                        },
                    },
                    {
                        groups: {
                            id: existUser.group.id,
                        },
                    },
                ];
            }
        } else {
            where = {};
        }

        const [data, total] = await this.alertsRepository.findAndCount({
            where,
            relations: {
                alertsType: true,
                faculty: true,
                department: true,
                groups: true,
                initiator: true,
            },
            order: { created_at: 'DESC' },
            skip,
            take: limit,
        });

        return { data, total };
    }

    async findOneAlert(id: string): Promise<Alerts> {
        const alert = await this.alertsRepository.findOne({
            where: { id },
            relations: {
                alertsType: true,
                faculty: true,
                department: true,
                groups: true,
                initiator: true,
            },
        });
        if (!alert) throw new NotFoundException('Уведомление не найдено');
        return alert;
    }

    async updateAlert(id: string, dto: UpdateAlertDto): Promise<Alerts> {
        const alert = await this.findOneAlert(id);

        if (dto.title !== undefined) alert.title = dto.title;
        if (dto.description !== undefined) alert.description = dto.description;
        if (dto.documents !== undefined) alert.documents = dto.documents;

        if (dto.alertsTypeId !== undefined) {
            const type = await this.alertsTypeRepository.findOneBy({
                id: dto.alertsTypeId,
            });
            if (!type) throw new NotFoundException('Тип уведомления не найден');
            alert.alertsType = type;
        }

        if (dto.facultyId !== undefined) {
            if (dto.facultyId === null) {
                alert.faculty = null;
            } else {
                const faculty = await this.facultyRepository.findOneBy({
                    id: dto.facultyId,
                });
                if (!faculty)
                    throw new NotFoundException('Факультет не найден');
                alert.faculty = faculty;
            }
        }

        if (dto.departmentId !== undefined) {
            if (dto.departmentId === null) {
                alert.department = null;
            } else {
                const department = await this.departmentRepository.findOneBy({
                    id: dto.departmentId,
                });
                if (!department)
                    throw new NotFoundException('Кафедра не найдена');
                alert.department = department;
            }
        }

        if (dto.groupId !== undefined) {
            if (dto.groupId === null) {
                alert.groups = null;
            } else {
                const group = await this.groupsRepository.findOneBy({
                    id: dto.groupId,
                });
                if (!group) throw new NotFoundException('Группа не найдена');
                alert.groups = group;
            }
        }

        return this.alertsRepository.save(alert);
    }

    async removeAlert(id: string): Promise<void> {
        const alert = await this.findOneAlert(id);
        await this.alertsRepository.remove(alert);
    }

    // ==================== GLOBAL ALERTS ====================
    async createGlobalAlert(
        dto: CreateGlobalAlertDto,
        user: Users,
    ): Promise<GlobalAlerts> {
        const globalAlert = new GlobalAlerts();
        globalAlert.title = dto.title;
        globalAlert.description = dto.description;
        globalAlert.documents = dto.documents;

        const initiator = await this.usersRepository.findOne({
            where: {
                id: user.id,
            },
            relations: { group: { groupLeader: true }, roleType: true },
        });
        if (!initiator) throw new NotFoundException('Инициатор не найден');
        if (initiator.roleType.id === 1)
            throw new ForbiddenException(
                'Глобальные уведомления только для админов',
            );
        globalAlert.initiator = initiator;

        return this.globalAlertsRepository.save(globalAlert);
    }

    async findAllGlobalAlerts(
        pagination: PaginationDto,
    ): Promise<{ data: GlobalAlerts[]; total: number }> {
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const [data, total] = await this.globalAlertsRepository.findAndCount({
            relations: { initiator: true },
            order: { created_at: 'DESC' },
            skip,
            take: limit,
        });

        return { data, total };
    }

    async findOneGlobalAlert(id: string): Promise<GlobalAlerts> {
        const alert = await this.globalAlertsRepository.findOne({
            where: { id },
            relations: { initiator: true },
        });
        if (!alert)
            throw new NotFoundException('Глобальное уведомление не найдено');
        return alert;
    }

    async updateGlobalAlert(
        id: string,
        dto: UpdateGlobalAlertDto,
    ): Promise<GlobalAlerts> {
        const alert = await this.findOneGlobalAlert(id);

        if (dto.title !== undefined) alert.title = dto.title;
        if (dto.description !== undefined) alert.description = dto.description;
        if (dto.documents !== undefined) alert.documents = dto.documents;

        return this.globalAlertsRepository.save(alert);
    }

    async removeGlobalAlert(id: string): Promise<void> {
        const alert = await this.findOneGlobalAlert(id);
        await this.globalAlertsRepository.remove(alert);
    }
}
