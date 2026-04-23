import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { ILike, Repository } from 'typeorm';
import { AssignUserStructureDto } from './dto/assign-user-structure.dto';
import { Department } from './entities/department.entity';
import { Faculty } from './entities/faculty.entity';
import { Groups } from './entities/group.entity';

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Department)
        private departmentRepository: Repository<Department>,
        @InjectRepository(Faculty)
        private facultyRepository: Repository<Faculty>,
        @InjectRepository(Groups)
        private groupsRepository: Repository<Groups>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
    ) {}

    async searchUsers(query?: string): Promise<Users[]> {
        const take = 10;
        const baseOptions: Parameters<typeof this.userRepository.find>[0] = {
            where: {
                roleType: { id: 1 }, // исключаем админов (roleType.id !== 1)
            },
            relations: {
                group: true,
                department: true,
                faculty: true,
                roleType: true,
            },
            order: { surname: 'ASC', name: 'ASC' },
            take,
        };

        if (!query?.trim()) {
            return this.userRepository.find(baseOptions);
        }

        const q = query.trim();
        return this.userRepository.find({
            ...baseOptions,
            where: [
                { name: ILike(`%${q}%`), roleType: { id: 1 } },
                { surname: ILike(`%${q}%`), roleType: { id: 1 } },
                { email: ILike(`%${q}%`), roleType: { id: 1 } },
                { phone: ILike(`%${q}%`), roleType: { id: 1 } },
            ],
        });
    }

    // ---------- НАЗНАЧЕНИЕ ПОЛЬЗОВАТЕЛЮ СТРУКТУРНОЙ ПРИНАДЛЕЖНОСТИ ----------
    async assignUserStructure(dto: AssignUserStructureDto) {
        const user = await this.userRepository.findOne({
            where: { id: dto.userId },
            relations: { group: true, department: true, faculty: true },
        });

        if (!user) {
            throw new Error('Пользователь не найден');
        }

        // Обработка groupId: 0 => очистить
        if (dto.groupId !== undefined) {
            if (dto.groupId === 0) {
                // Если у пользователя была группа и он был её старостой — снимаем
                if (user.group && dto.isElder === false) {
                    await this.groupsRepository.update(
                        { id: user.group.id },
                        { groupLeader: null },
                    );
                }
                user.group = null;
                user.isElder = false;
            } else {
                const group = await this.groupsRepository.findOne({
                    where: { id: dto.groupId },
                    relations: { groupLeader: true },
                });
                if (!group) throw new Error('Указанная группа не найдена');

                user.group = group;

                // Логика назначения/снятия старосты
                if (dto.isElder) {
                    // Назначаем пользователя старостой группы
                    await this.groupsRepository.update(
                        { id: group.id },
                        { groupLeader: user },
                    );
                    user.isElder = true;
                } else {
                    // Если пользователь был старостой этой группы — снимаем
                    if (group.groupLeader && group.groupLeader.id === user.id) {
                        await this.groupsRepository.update(
                            { id: group.id },
                            { groupLeader: null },
                        );
                    }
                    user.isElder = false;
                }
            }
        } else if (dto.isElder !== undefined) {
            // groupId не передан, но флаг isElder изменён
            if (dto.isElder && user.group) {
                // Назначаем старостой текущей группы
                await this.groupsRepository.update(
                    { id: user.group.id },
                    { groupLeader: user },
                );
                user.isElder = true;
            } else if (!dto.isElder && user.group) {
                // Снимаем с должности старосты
                const group = await this.groupsRepository.findOne({
                    where: { id: user.group.id },
                    relations: { groupLeader: true },
                });
                if (
                    group &&
                    group.groupLeader &&
                    group.groupLeader.id === user.id
                ) {
                    await this.groupsRepository.update(
                        { id: group.id },
                        { groupLeader: null },
                    );
                }
                user.isElder = false;
            }
        }

        // Обработка departmentId: 0 => очистить
        if (dto.departmentId !== undefined) {
            if (dto.departmentId === 0) {
                user.department = null;
            } else {
                const department = await this.departmentRepository.findOneBy({
                    id: dto.departmentId,
                });
                if (!department)
                    throw new Error('Указанная кафедра не найдена');
                user.department = department;
            }
        }

        // Обработка facultyId: 0 => очистить
        if (dto.facultyId !== undefined) {
            if (dto.facultyId === 0) {
                user.faculty = null;
            } else {
                const faculty = await this.facultyRepository.findOneBy({
                    id: dto.facultyId,
                });
                if (!faculty) throw new Error('Указанный факультет не найден');
                user.faculty = faculty;
            }
        }

        await this.userRepository.save(user);

        return this.userRepository.findOne({
            where: { id: dto.userId },
            relations: { group: true, department: true, faculty: true },
        });
    }

    // ---------- ПОИСК ФАКУЛЬТЕТОВ ----------
    async searchFaculties(query?: string): Promise<Faculty[]> {
        const take = 10;
        if (!query?.trim()) {
            return this.facultyRepository.find({
                order: { name: 'ASC' },
                take,
            });
        }
        const q = query.trim();
        return this.facultyRepository.find({
            where: [{ name: ILike(`%${q}%`) }, { shortName: ILike(`%${q}%`) }],
            order: { name: 'ASC' },
            take,
        });
    }

    // ---------- ПОИСК КАФЕДР ----------
    async searchDepartments(query?: string): Promise<Department[]> {
        const take = 10;
        const baseOptions: Parameters<
            typeof this.departmentRepository.find
        >[0] = {
            relations: { faculty: true },
            order: { name: 'ASC' },
            take,
        };
        if (!query?.trim()) {
            return this.departmentRepository.find(baseOptions);
        }
        const q = query.trim();
        return this.departmentRepository.find({
            ...baseOptions,
            where: { name: ILike(`%${q}%`) },
        });
    }

    // ---------- ПОИСК ГРУПП ----------
    async searchGroups(query?: string): Promise<Groups[]> {
        const take = 10;
        const baseOptions: Parameters<typeof this.groupsRepository.find>[0] = {
            relations: { department: true },
            order: { name: 'ASC' },
            take,
        };
        if (!query?.trim()) {
            return this.groupsRepository.find(baseOptions);
        }
        const q = query.trim();
        return this.groupsRepository.find({
            ...baseOptions,
            where: [{ name: ILike(`%${q}%`) }, { groupCode: ILike(`%${q}%`) }],
        });
    }

    async getFacultyById(id: number): Promise<Faculty> {
        const faculty = await this.facultyRepository.findOneBy({ id });
        if (!faculty) throw new Error('Факультет не найден');
        return faculty;
    }

    async getDepartmentById(id: number): Promise<Department> {
        const department = await this.departmentRepository.findOne({
            where: { id },
            relations: { faculty: true },
        });
        if (!department) throw new Error('Кафедра не найдена');
        return department;
    }

    async getGroupById(id: number): Promise<Groups> {
        const group = await this.groupsRepository.findOne({
            where: { id },
            relations: { department: true },
        });
        if (!group) throw new Error('Группа не найдена');
        return group;
    }
}
