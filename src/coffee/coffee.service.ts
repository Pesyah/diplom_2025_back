import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateCoffeeAdditiveRelationDto } from './dto/create-coffee-additive-relation.dto';
import { CreateCoffeeAdditiveDto } from './dto/create-coffee-additive.dto';
import { CreateCoffeeVolumeRelationDto } from './dto/create-coffee-volume-relation.dto';
import { CreateCoffeeVolumeDto } from './dto/create-coffee-volume.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeAdditiveRelationDto } from './dto/update-coffee-additive-relation.dto';
import { UpdateCoffeeAdditiveDto } from './dto/update-coffee-additive.dto';
import { UpdateCoffeeVolumeRelationDto } from './dto/update-coffee-volume-relation.dto';
import { UpdateCoffeeVolumeDto } from './dto/update-coffee-volume.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { CoffeeAdditiveRelation } from './entities/coffee-additive-relation.entity';
import { CoffeeAdditive } from './entities/coffee-additive.entity';
import { CoffeeVolumeRelation } from './entities/coffee-volume-relation.entity';
import { CoffeeVolume } from './entities/coffee-volume.entity';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeeService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepo: Repository<Coffee>,
        @InjectRepository(CoffeeVolume)
        private readonly coffeeVolumeRepo: Repository<CoffeeVolume>,
        @InjectRepository(CoffeeVolumeRelation)
        private readonly coffeeVolumeRelationRepo: Repository<CoffeeVolumeRelation>,
        @InjectRepository(CoffeeAdditive)
        private readonly coffeeAdditiveRepo: Repository<CoffeeAdditive>,
        @InjectRepository(CoffeeAdditiveRelation)
        private readonly coffeeAdditiveRelationRepo: Repository<CoffeeAdditiveRelation>,
    ) {}

    // ===================== COFFEE =====================

    async findAllActive(): Promise<Coffee[]> {
        return this.coffeeRepo.find({
            where: {},
            relations: {
                coffeeVolumeRelation: true,
            },
        });
    }

    async findById(id: string): Promise<Coffee> {
        const coffee = await this.coffeeRepo.findOne({
            where: { id },
            relations: {
                coffeeVolumeRelation: {
                    coffeeAdditiveRelation: {
                        coffeeAdditive: true,
                    },
                    coffeeVolume: true,
                },
            },
        });
        if (!coffee) {
            throw new NotFoundException(`Кофе с id ${id} не найден`);
        }
        return coffee;
    }

    async findAllAdmin(): Promise<Coffee[]> {
        return this.coffeeRepo.find({ withDeleted: true });
    }

    async findDeletedAdmin(): Promise<Coffee[]> {
        return this.coffeeRepo.find({
            where: { deleted_at: Not(IsNull()) },
            withDeleted: true,
        });
    }

    async create(dto: CreateCoffeeDto): Promise<Coffee> {
        const coffee = this.coffeeRepo.create(dto);
        return this.coffeeRepo.save(coffee);
    }

    async update(dto: UpdateCoffeeDto): Promise<Coffee> {
        const coffee = await this.coffeeRepo.findOne({
            where: { id: dto.id, deleted_at: IsNull() },
        });
        if (!coffee) {
            throw new NotFoundException(`Кофе с id ${dto.id} не найден`);
        }
        Object.assign(coffee, dto);
        return this.coffeeRepo.save(coffee);
    }

    async softDelete(id: string): Promise<void> {
        const result = await this.coffeeRepo.softDelete(id);
        if (!result.affected) {
            throw new NotFoundException(`Кофе с id ${id} не найден`);
        }
    }

    async restore(id: string): Promise<void> {
        const result = await this.coffeeRepo.restore(id);
        if (!result.affected) {
            throw new NotFoundException(`Кофе с id ${id} не найден`);
        }
    }

    // ===================== COFFEE VOLUME =====================

    async findAllCoffeeVolumes(): Promise<CoffeeVolume[]> {
        return this.coffeeVolumeRepo.find();
    }

    async createCoffeeVolume(
        dto: CreateCoffeeVolumeDto,
    ): Promise<CoffeeVolume> {
        const existing = await this.coffeeVolumeRepo.findOne({
            where: { name: dto.name },
        });
        if (existing) {
            throw new ConflictException(
                `Объем с id ${dto.name} уже существует`,
            );
        }
        const volume = this.coffeeVolumeRepo.create(dto);
        return this.coffeeVolumeRepo.save(volume);
    }

    async updateCoffeeVolume(
        dto: UpdateCoffeeVolumeDto,
    ): Promise<CoffeeVolume> {
        const volume = await this.coffeeVolumeRepo.findOne({
            where: { id: dto.id },
        });
        if (!volume) {
            throw new NotFoundException(`Объем с id ${dto.id} не найден`);
        }
        volume.name = dto.name;
        return this.coffeeVolumeRepo.save(volume);
    }

    async deleteCoffeeVolume(id: number): Promise<void> {
        const result = await this.coffeeVolumeRepo.delete(id);
        if (!result.affected) {
            throw new NotFoundException(`Объем с id ${id} не найден`);
        }
    }

    // ===================== COFFEE VOLUME RELATION =====================

    async findVolumeRelationsByCoffee(
        coffeeId: string,
    ): Promise<CoffeeVolumeRelation[]> {
        return this.coffeeVolumeRelationRepo.find({
            where: { coffee: { id: coffeeId } },
            relations: ['coffeeVolume'],
        });
    }

    async findAllVolumeRelationsAdmin(): Promise<CoffeeVolumeRelation[]> {
        return this.coffeeVolumeRelationRepo.find({
            relations: ['coffee', 'coffeeVolume'],
        });
    }

    async createVolumeRelation(
        dto: CreateCoffeeVolumeRelationDto,
    ): Promise<CoffeeVolumeRelation> {
        const coffee = await this.coffeeRepo.findOne({
            where: { id: dto.coffeeId, deleted_at: IsNull() },
        });
        if (!coffee) {
            throw new NotFoundException(`Кофе с id ${dto.coffeeId} не найден`);
        }

        const coffeeVolume = await this.coffeeVolumeRepo.findOne({
            where: { id: dto.coffeeVolumeId },
        });
        if (!coffeeVolume) {
            throw new NotFoundException(
                `Объем с id ${dto.coffeeVolumeId} не найден`,
            );
        }

        const relation = this.coffeeVolumeRelationRepo.create({
            coffee,
            coffeeVolume,
            price: dto.price,
        });
        return this.coffeeVolumeRelationRepo.save(relation);
    }

    async updateVolumeRelation(
        dto: UpdateCoffeeVolumeRelationDto,
    ): Promise<CoffeeVolumeRelation> {
        const relation = await this.coffeeVolumeRelationRepo.findOne({
            where: { id: dto.id },
        });
        if (!relation) {
            throw new NotFoundException(
                `Связь кофе-объем с id ${dto.id} не найдена`,
            );
        }
        if (dto.price !== undefined) {
            relation.price = dto.price;
        }
        return this.coffeeVolumeRelationRepo.save(relation);
    }

    async deleteVolumeRelation(id: number): Promise<void> {
        const result = await this.coffeeVolumeRelationRepo.delete(id);
        if (!result.affected) {
            throw new NotFoundException(
                `Связь кофе-объем с id ${id} не найдена`,
            );
        }
    }

    // ===================== COFFEE ADDITIVE =====================

    async findAllCoffeeAdditives(): Promise<CoffeeAdditive[]> {
        return this.coffeeAdditiveRepo.find();
    }

    async createCoffeeAdditive(
        dto: CreateCoffeeAdditiveDto,
    ): Promise<CoffeeAdditive> {
        const existing = await this.coffeeAdditiveRepo.findOne({
            where: { name: dto.name },
        });
        if (existing) {
            throw new ConflictException(
                `Добавка с id ${dto.name} уже существует`,
            );
        }
        const additive = this.coffeeAdditiveRepo.create(dto);
        return this.coffeeAdditiveRepo.save(additive);
    }

    async updateCoffeeAdditive(
        dto: UpdateCoffeeAdditiveDto,
    ): Promise<CoffeeAdditive> {
        const additive = await this.coffeeAdditiveRepo.findOne({
            where: { id: dto.id },
        });
        if (!additive) {
            throw new NotFoundException(`Добавка с id ${dto.id} не найдена`);
        }
        additive.name = dto.name;
        additive.avatar = dto.avatar;
        return this.coffeeAdditiveRepo.save(additive);
    }

    async deleteCoffeeAdditive(id: number): Promise<void> {
        const result = await this.coffeeAdditiveRepo.delete(id);
        if (!result.affected) {
            throw new NotFoundException(`Добавка с id ${id} не найдена`);
        }
    }

    // ===================== COFFEE ADDITIVE RELATION =====================

    async findAdditiveRelationsByCoffeeVolume(
        coffeeVolumeRelationId: number,
    ): Promise<CoffeeAdditiveRelation[]> {
        return this.coffeeAdditiveRelationRepo.find({
            where: { coffeeVolumeRelation: { id: coffeeVolumeRelationId } },
            relations: ['coffeeAdditive'],
        });
    }

    async findAllAdditiveRelationsAdmin(): Promise<CoffeeAdditiveRelation[]> {
        return this.coffeeAdditiveRelationRepo.find({
            relations: ['coffeeVolumeRelation', 'coffeeAdditive'],
        });
    }

    async createAdditiveRelation(
        dto: CreateCoffeeAdditiveRelationDto,
    ): Promise<CoffeeAdditiveRelation> {
        const volumeRelation = await this.coffeeVolumeRelationRepo.findOne({
            where: { id: dto.coffeeVolumeRelationId },
        });
        if (!volumeRelation) {
            throw new NotFoundException(
                `Связь кофе-объем с id ${dto.coffeeVolumeRelationId} не найдена`,
            );
        }

        const additive = await this.coffeeAdditiveRepo.findOne({
            where: { id: dto.coffeeAdditiveId },
        });
        if (!additive) {
            throw new NotFoundException(
                `Добавка с id ${dto.coffeeAdditiveId} не найдена`,
            );
        }

        const relation = this.coffeeAdditiveRelationRepo.create({
            coffeeVolumeRelation: volumeRelation,
            coffeeAdditive: additive,
            price: dto.price,
        });
        return this.coffeeAdditiveRelationRepo.save(relation);
    }

    async updateAdditiveRelation(
        dto: UpdateCoffeeAdditiveRelationDto,
    ): Promise<CoffeeAdditiveRelation> {
        const relation = await this.coffeeAdditiveRelationRepo.findOne({
            where: { id: dto.id },
        });
        if (!relation) {
            throw new NotFoundException(
                `Связь объем-добавка с id ${dto.id} не найдена`,
            );
        }
        if (dto.price !== undefined) {
            relation.price = dto.price;
        }
        return this.coffeeAdditiveRelationRepo.save(relation);
    }

    async deleteAdditiveRelation(id: number): Promise<void> {
        const result = await this.coffeeAdditiveRelationRepo.delete(id);
        if (!result.affected) {
            throw new NotFoundException(
                `Связь объем-добавка с id ${id} не найдена`,
            );
        }
    }
}
