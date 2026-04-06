import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PizzaAdditiveRelation } from './entities/pizza-additive-relations.entity';
import { PizzaAdditive } from './entities/pizza-additive.entity';
import { PizzaSizeRelation } from './entities/pizza-size-relations.entity';
import { PizzaSize } from './entities/pizza-size.entity';
import { PizzaType } from './entities/pizza-type.entity';
import { Pizza } from './entities/pizza.entity';

@Injectable()
export class PizzaService {
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

    async getPizzaById(id: string) {
        return this.pizzaRepository.findOne({
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
    }
}
