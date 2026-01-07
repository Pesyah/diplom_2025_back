import { Body, Controller, Post } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Users } from 'src/auth/entities/users.entity';
import { CreatePizzaDto } from './dto/admin/create-pizza.dto';
import { PizzaAdminService } from './pizza-admin.service';

@Controller('pizza')
export class PizzaController {
    constructor(private readonly pizzaAdminService: PizzaAdminService) {}

    @Post()
    async createNewPizza(
        @GetUser() users: Users,
        @Body() createPizzaDto: CreatePizzaDto,
    ) {
        return this.pizzaAdminService.createPizza(createPizzaDto, users);
    }
}
