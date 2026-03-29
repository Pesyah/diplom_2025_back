import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreatePizzaAdditiveRelationDto } from './dto/admin/create-pizza-additive-relation.dto';
import { CreatePizzaAdditiveDto } from './dto/admin/create-pizza-additive.dto';
import { CreatePizzaSizeRelationDto } from './dto/admin/create-pizza-size-relation.dto';
import { CreatePizzaSizeDto } from './dto/admin/create-pizza-size.dto';
import {
    CreatePizzaDto,
    UpdatePizzaAdditiveDto,
    UpdatePizzaAdditiveRelationDto,
    UpdatePizzaSizeDto,
    UpdatePizzaSizeRelationDto,
} from './dto/admin/create-pizza.dto';
import { UpdatePizzaDto } from './dto/update-pizza.dto';
import { PizzaAdditiveRelation } from './entities/pizza-additive-relations.entity';
import { PizzaAdditive } from './entities/pizza-additive.entity';
import { PizzaSizeRelation } from './entities/pizza-size-relations.entity';
import { PizzaSize } from './entities/pizza-size.entity';
import { PizzaType } from './entities/pizza-type.entity';
import { Pizza } from './entities/pizza.entity';

@Injectable()
export class PizzaAdminService {
    constructor(
        @InjectRepository(Pizza)
        private readonly pizzaRepository: Repository<Pizza>,
        @InjectRepository(PizzaAdditiveRelation)
        private readonly pizzaAdditiveRelationRepository: Repository<PizzaAdditiveRelation>,
        @InjectRepository(PizzaAdditive)
        private readonly pizzaAdditiveRepository: Repository<PizzaAdditive>,
        @InjectRepository(PizzaSizeRelation)
        private readonly pizzaSizeRelationRepository: Repository<PizzaSizeRelation>,
        @InjectRepository(PizzaSize)
        private readonly pizzaSizeRepository: Repository<PizzaSize>,
        @InjectRepository(PizzaType)
        private readonly pizzaTypeRepository: Repository<PizzaType>,
    ) {}

    async allRelations() {
        return {
            pizza: await this.pizzaRepository.find(),
            pizzaType: await this.pizzaTypeRepository.find(),
            pizzaSize: await this.pizzaSizeRepository.find(),
            pizzaSizeRelation: await this.pizzaSizeRelationRepository.find(),
            pizzaAdditive: await this.pizzaAdditiveRepository.find(),
            pizzaAdditiveRelation:
                await this.pizzaAdditiveRelationRepository.find(),
        };
    }

    async createPizza(createPizzaDto: CreatePizzaDto) {
        const pizzaType = await this.pizzaTypeRepository.findOneBy({
            id: createPizzaDto.pizzaType,
        });
        if (!pizzaType)
            throw new HttpException(
                'pizzaType not found',
                HttpStatus.NOT_FOUND,
            );
        createPizzaDto.pizzaType = pizzaType;

        const newPizza = await this.pizzaRepository.save(
            this.pizzaRepository.create(createPizzaDto),
        );
        return newPizza;
    }

    async createPizzaAdditive(createPizzaAdditiveDto: CreatePizzaAdditiveDto) {
        const existAdditive = await this.pizzaAdditiveRepository.findOneBy({
            name: ILike(`%${createPizzaAdditiveDto.name}%`),
        });
        if (existAdditive)
            throw new HttpException(
                'pizza additive is already exist',
                HttpStatus.CONFLICT,
            );
        return this.pizzaAdditiveRepository.save(
            this.pizzaAdditiveRepository.create({
                name: createPizzaAdditiveDto.name,
                avatar: createPizzaAdditiveDto.avatar,
            }),
        );
    }

    async createPizzaAdditiveRelation(
        createPizzaAdditiveRelationDto: CreatePizzaAdditiveRelationDto,
    ) {
        // связь пицца+размер
        const pizzaSizeRelation =
            await this.pizzaSizeRelationRepository.findOneBy({
                id: createPizzaAdditiveRelationDto.pizzaSizeRelation,
            });
        if (!pizzaSizeRelation)
            throw new HttpException(
                'pizzaSizeRelation not found',
                HttpStatus.NOT_FOUND,
            );
        const pizzaAdditive = await this.pizzaAdditiveRepository.findOneBy({
            id: createPizzaAdditiveRelationDto.pizzaAdditive,
        });
        if (!pizzaAdditive)
            throw new HttpException(
                'pizzaAdditive not found',
                HttpStatus.NOT_FOUND,
            );

        const newRelation = this.pizzaAdditiveRelationRepository.create({
            pizzaAdditive,
            pizzaSizeRelation,
            isAdd: createPizzaAdditiveRelationDto.isAdd,
            price: createPizzaAdditiveRelationDto.price,
        });
        return this.pizzaAdditiveRelationRepository.save(newRelation);
    }

    async createPizzaSize(createPizzaSizeDto: CreatePizzaSizeDto) {
        const existSize = await this.pizzaSizeRepository.findOneBy({
            name: ILike(`%${createPizzaSizeDto.name}%`),
        });
        if (existSize)
            throw new HttpException(
                'pizza size is already exist',
                HttpStatus.CONFLICT,
            );
        return this.pizzaSizeRepository.save(
            this.pizzaSizeRepository.create({
                name: createPizzaSizeDto.name,
            }),
        );
    }

    async createPizzaSizeRelation(
        createPizzaSizeRelationDto: CreatePizzaSizeRelationDto,
    ) {
        const pizzaSize = await this.pizzaSizeRepository.findOneBy({
            id: createPizzaSizeRelationDto.pizzaSize,
        });
        if (!pizzaSize)
            throw new HttpException(
                'pizzaSize not found',
                HttpStatus.NOT_FOUND,
            );
        const pizza = await this.pizzaRepository.findOneBy({
            id: createPizzaSizeRelationDto.pizza,
        });
        if (!pizza)
            throw new HttpException('pizza not found', HttpStatus.NOT_FOUND);

        const newRelation = this.pizzaSizeRelationRepository.create({
            pizza,
            pizzaSize,
            price: createPizzaSizeRelationDto.price,
        });
        return this.pizzaSizeRelationRepository.save(newRelation);
    }

    async getPizza() {
        return this.pizzaRepository.find({
            relations: {
                pizzaType: true,
                pizzaSizeRelation: {
                    pizzaSize: true,
                    pizzaAdditiveRelation: {
                        pizzaAdditive: true,
                    },
                },
            },
        });
    }

    async getOnePizza(id: string) {
        const pizza = await this.pizzaRepository.findOne({
            where: { id },
            relations: {
                pizzaType: true,
                pizzaSizeRelation: {
                    pizzaSize: true,
                    pizzaAdditiveRelation: {
                        pizzaAdditive: true,
                    },
                },
            },
        });

        if (!pizza) {
            throw new HttpException('Pizza not found', HttpStatus.NOT_FOUND);
        }

        return pizza;
    }

    async deletePizza(id: string) {
        // Сначала удаляем все связи, чтобы не нарушить целостность
        const pizza = await this.pizzaRepository.findOne({
            where: { id },
            relations: {
                pizzaSizeRelation: true,
            },
        });

        if (!pizza) {
            throw new HttpException('Pizza not found', HttpStatus.NOT_FOUND);
        }

        // Удаляем все связи размеров (они каскадно удалят связи добавок)
        await this.pizzaSizeRelationRepository.remove(pizza.pizzaSizeRelation);

        // Удаляем саму пиццу
        return this.pizzaRepository.remove(pizza);
    }

    async updatePizza(id: string, updatePizzaDto: UpdatePizzaDto) {
        const pizza = await this.pizzaRepository.findOne({
            where: { id },
            relations: ['pizzaType'],
        });

        if (!pizza) {
            throw new HttpException('Pizza not found', HttpStatus.NOT_FOUND);
        }

        if (updatePizzaDto.pizzaType) {
            const pizzaType = await this.pizzaTypeRepository.findOneBy({
                id: updatePizzaDto.pizzaType,
            });
            if (!pizzaType) {
                throw new HttpException(
                    'pizzaType not found',
                    HttpStatus.NOT_FOUND,
                );
            }
            pizza.pizzaType = pizzaType;
            delete updatePizzaDto.pizzaType;
        }

        Object.assign(pizza, updatePizzaDto);
        return this.pizzaRepository.save(pizza);
    }

    // ==================== PIZZA SIZE CRUD ====================
    async getAllPizzaSizes() {
        return this.pizzaSizeRepository.find();
    }

    async getOnePizzaSize(id: string) {
        const size = await this.pizzaSizeRepository.findOneBy({ id });
        if (!size) {
            throw new HttpException(
                'Pizza size not found',
                HttpStatus.NOT_FOUND,
            );
        }
        return size;
    }

    async updatePizzaSize(id: string, updatePizzaSizeDto: UpdatePizzaSizeDto) {
        const size = await this.getOnePizzaSize(id);
        Object.assign(size, updatePizzaSizeDto);
        return this.pizzaSizeRepository.save(size);
    }

    async deletePizzaSize(id: string) {
        const size = await this.getOnePizzaSize(id);

        // Проверяем, есть ли связанные записи
        const relations = await this.pizzaSizeRelationRepository.find({
            where: { pizzaSize: { id } },
            relations: ['pizzaAdditiveRelation'],
        });

        if (relations.length > 0) {
            // Удаляем все связи добавок
            for (const relation of relations) {
                if (relation.pizzaAdditiveRelation) {
                    await this.pizzaAdditiveRelationRepository.remove(
                        relation.pizzaAdditiveRelation,
                    );
                }
            }
            // Удаляем связи размеров
            await this.pizzaSizeRelationRepository.remove(relations);
        }

        return this.pizzaSizeRepository.remove(size);
    }

    // ==================== PIZZA SIZE RELATION CRUD ====================
    async getAllPizzaSizeRelations() {
        return this.pizzaSizeRelationRepository.find({
            relations: ['pizza', 'pizzaSize'],
        });
    }

    async getOnePizzaSizeRelation(id: string) {
        const relation = await this.pizzaSizeRelationRepository.findOne({
            where: { id },
            relations: ['pizza', 'pizzaSize', 'pizzaAdditiveRelation'],
        });
        if (!relation) {
            throw new HttpException(
                'Pizza size relation not found',
                HttpStatus.NOT_FOUND,
            );
        }
        return relation;
    }

    async updatePizzaSizeRelation(
        id: string,
        updateDto: UpdatePizzaSizeRelationDto,
    ) {
        const relation = await this.getOnePizzaSizeRelation(id);

        if (updateDto.pizza) {
            const pizza = await this.pizzaRepository.findOneBy({
                id: updateDto.pizza,
            });
            if (!pizza)
                throw new HttpException(
                    'Pizza not found',
                    HttpStatus.NOT_FOUND,
                );
            relation.pizza = pizza;
        }

        if (updateDto.pizzaSize) {
            const pizzaSize = await this.pizzaSizeRepository.findOneBy({
                id: updateDto.pizzaSize,
            });
            if (!pizzaSize)
                throw new HttpException(
                    'Pizza size not found',
                    HttpStatus.NOT_FOUND,
                );
            relation.pizzaSize = pizzaSize;
        }

        return this.pizzaSizeRelationRepository.save(relation);
    }

    async deletePizzaSizeRelation(id: string) {
        const relation = await this.getOnePizzaSizeRelation(id);

        // Удаляем все связанные добавки
        if (relation.pizzaAdditiveRelation) {
            await this.pizzaAdditiveRelationRepository.remove(
                relation.pizzaAdditiveRelation,
            );
        }

        return this.pizzaSizeRelationRepository.remove(relation);
    }

    // ==================== PIZZA ADDITIVE CRUD ====================
    async getAllPizzaAdditives() {
        return this.pizzaAdditiveRepository.find();
    }

    async getOnePizzaAdditive(id: string) {
        const additive = await this.pizzaAdditiveRepository.findOneBy({ id });
        if (!additive) {
            throw new HttpException(
                'Pizza additive not found',
                HttpStatus.NOT_FOUND,
            );
        }
        return additive;
    }

    async updatePizzaAdditive(
        id: string,
        updatePizzaAdditiveDto: UpdatePizzaAdditiveDto,
    ) {
        const additive = await this.getOnePizzaAdditive(id);

        // Проверяем уникальность имени при обновлении
        if (updatePizzaAdditiveDto.name) {
            const existAdditive = await this.pizzaAdditiveRepository.findOne({
                where: { name: ILike(`%${updatePizzaAdditiveDto.name}%`) },
            });
            if (existAdditive && existAdditive.id !== id) {
                throw new HttpException(
                    'Pizza additive with this name already exists',
                    HttpStatus.CONFLICT,
                );
            }
        }

        Object.assign(additive, updatePizzaAdditiveDto);
        return this.pizzaAdditiveRepository.save(additive);
    }

    async deletePizzaAdditive(id: string) {
        const additive = await this.getOnePizzaAdditive(id);

        // Проверяем, используется ли добавка в каких-либо связях
        const relations = await this.pizzaAdditiveRelationRepository.find({
            where: { pizzaAdditive: { id } },
        });

        if (relations.length > 0) {
            throw new HttpException(
                `Cannot delete additive: it is used in ${relations.length} pizza size relation(s)`,
                HttpStatus.BAD_REQUEST,
            );
        }

        return this.pizzaAdditiveRepository.remove(additive);
    }

    // ==================== PIZZA ADDITIVE RELATION CRUD ====================
    async getAllPizzaAdditiveRelations() {
        return this.pizzaAdditiveRelationRepository.find({
            relations: ['pizzaSizeRelation', 'pizzaAdditive'],
        });
    }

    async getOnePizzaAdditiveRelation(id: string) {
        const relation = await this.pizzaAdditiveRelationRepository.findOne({
            where: { id },
            relations: ['pizzaSizeRelation', 'pizzaAdditive'],
        });
        if (!relation) {
            throw new HttpException(
                'Pizza additive relation not found',
                HttpStatus.NOT_FOUND,
            );
        }
        return relation;
    }

    async updatePizzaAdditiveRelation(
        id: string,
        updateDto: UpdatePizzaAdditiveRelationDto,
    ) {
        const relation = await this.getOnePizzaAdditiveRelation(id);

        if (updateDto.pizzaSizeRelation) {
            const pizzaSizeRelation =
                await this.pizzaSizeRelationRepository.findOneBy({
                    id: updateDto.pizzaSizeRelation,
                });
            if (!pizzaSizeRelation) {
                throw new HttpException(
                    'Pizza size relation not found',
                    HttpStatus.NOT_FOUND,
                );
            }
            relation.pizzaSizeRelation = pizzaSizeRelation;
        }

        if (updateDto.pizzaAdditive) {
            const pizzaAdditive = await this.pizzaAdditiveRepository.findOneBy({
                id: updateDto.pizzaAdditive,
            });
            if (!pizzaAdditive) {
                throw new HttpException(
                    'Pizza additive not found',
                    HttpStatus.NOT_FOUND,
                );
            }
            relation.pizzaAdditive = pizzaAdditive;
        }

        return this.pizzaAdditiveRelationRepository.save(relation);
    }

    async deletePizzaAdditiveRelation(id: string) {
        const relation = await this.getOnePizzaAdditiveRelation(id);
        return this.pizzaAdditiveRelationRepository.remove(relation);
    }
}
