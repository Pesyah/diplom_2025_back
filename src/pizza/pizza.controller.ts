import { Controller } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { PizzaService } from './pizza.service';

@ApiSecurity('X-AUTH-TOKEN')
@Controller('pizza')
export class PizzaController {
    constructor(private readonly pizzaService: PizzaService) {}
}
