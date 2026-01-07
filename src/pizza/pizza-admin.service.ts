import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { Repository } from 'typeorm';
import { CreatePizzaDto } from './dto/admin/create-pizza.dto';
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

    async createPizza(createPizzaDto: CreatePizzaDto, users: Users) {
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
}
