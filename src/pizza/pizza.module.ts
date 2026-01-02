import { Module } from '@nestjs/common';
import { PizzaService } from './pizza.service';
import { PizzaController } from './pizza.controller';

@Module({
  controllers: [PizzaController],
  providers: [PizzaService],
})
export class PizzaModule {}
