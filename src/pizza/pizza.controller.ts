import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { PizzaService } from './pizza.service';

@ApiSecurity('X-AUTH-TOKEN')
@Controller('pizza')
export class PizzaController {
    constructor(private readonly pizzaService: PizzaService) {}

    @Get('all-pizza')
    async getPizza() {
        return this.pizzaService.getPizza();
    }

    @Get('by-id/:id')
    async getPizzaById(@Param('id', ParseUUIDPipe) id: string) {
        return this.pizzaService.getPizzaById(id);
    }
}
