import { PartialType } from '@nestjs/swagger';
import { CreatePizzaDto } from './admin/create-pizza.dto';

export class UpdatePizzaDto extends PartialType(CreatePizzaDto) {}
