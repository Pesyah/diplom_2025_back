import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { PizzaAdditiveRelation } from './entities/pizza-additive-relations.entity';
import { PizzaAdditive } from './entities/pizza-additive.entity';
import { PizzaSizeRelation } from './entities/pizza-size-relations.entity';
import { PizzaSize } from './entities/pizza-size.entity';
import { PizzaType } from './entities/pizza-type.entity';
import { Pizza } from './entities/pizza.entity';
import { PizzaController } from './pizza.controller';
import { PizzaService } from './pizza.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Pizza,
            PizzaAdditive,
            PizzaSize,
            PizzaAdditiveRelation,
            PizzaSizeRelation,
            PizzaType,
            Users,
        ]),
    ],
    controllers: [PizzaController],
    providers: [PizzaService],
})
export class PizzaModule {}
