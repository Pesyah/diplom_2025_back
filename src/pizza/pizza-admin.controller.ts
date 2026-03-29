import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
} from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
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
import { PizzaAdminService } from './pizza-admin.service';

@ApiSecurity('X-AUTH-TOKEN')
@Controller('pizza-admin')
export class PizzaAdminController {
    constructor(private readonly pizzaAdminService: PizzaAdminService) {}

    // TODO https://chat.deepseek.com/a/chat/s/9abbb147-354f-4301-87b0-611f1fcf205f
    // ==================== ALL RELATIONS ====================
    @Get('all-relations')
    async getAllRelations() {
        return this.pizzaAdminService.allRelations();
    }

    // ==================== PIZZA CRUD ====================
    @Get('pizza')
    async getAllPizzas() {
        return this.pizzaAdminService.getPizza();
    }

    @Get('pizza/:id')
    async getOnePizza(@Param('id', ParseUUIDPipe) id: string) {
        return this.pizzaAdminService.getOnePizza(id);
    }

    @Post('pizza')
    async createPizza(@Body() createPizzaDto: CreatePizzaDto) {
        return this.pizzaAdminService.createPizza(createPizzaDto);
    }

    @Put('pizza/:id')
    async updatePizza(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updatePizzaDto: UpdatePizzaDto,
    ) {
        return this.pizzaAdminService.updatePizza(id, updatePizzaDto);
    }

    @Delete('pizza/:id')
    async deletePizza(@Param('id', ParseUUIDPipe) id: string) {
        return this.pizzaAdminService.deletePizza(id);
    }

    // ==================== PIZZA SIZE CRUD ====================
    @Get('pizza-size')
    async getAllPizzaSizes() {
        return this.pizzaAdminService.getAllPizzaSizes();
    }

    @Get('pizza-size/:id')
    async getOnePizzaSize(@Param('id', ParseUUIDPipe) id: string) {
        return this.pizzaAdminService.getOnePizzaSize(id);
    }

    @Post('pizza-size')
    async createPizzaSize(@Body() createPizzaSizeDto: CreatePizzaSizeDto) {
        return this.pizzaAdminService.createPizzaSize(createPizzaSizeDto);
    }

    @Put('pizza-size/:id')
    async updatePizzaSize(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updatePizzaSizeDto: UpdatePizzaSizeDto,
    ) {
        return this.pizzaAdminService.updatePizzaSize(id, updatePizzaSizeDto);
    }

    @Delete('pizza-size/:id')
    async deletePizzaSize(@Param('id', ParseUUIDPipe) id: string) {
        return this.pizzaAdminService.deletePizzaSize(id);
    }

    // ==================== PIZZA SIZE RELATION CRUD ====================
    @Get('pizza-size-relation')
    async getAllPizzaSizeRelations() {
        return this.pizzaAdminService.getAllPizzaSizeRelations();
    }

    @Get('pizza-size-relation/:id')
    async getOnePizzaSizeRelation(@Param('id', ParseUUIDPipe) id: string) {
        return this.pizzaAdminService.getOnePizzaSizeRelation(id);
    }

    @Post('pizza-size-relation')
    async createPizzaSizeRelation(
        @Body() createPizzaSizeRelationDto: CreatePizzaSizeRelationDto,
    ) {
        return this.pizzaAdminService.createPizzaSizeRelation(
            createPizzaSizeRelationDto,
        );
    }

    @Put('pizza-size-relation/:id')
    async updatePizzaSizeRelation(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updatePizzaSizeRelationDto: UpdatePizzaSizeRelationDto,
    ) {
        return this.pizzaAdminService.updatePizzaSizeRelation(
            id,
            updatePizzaSizeRelationDto,
        );
    }

    @Delete('pizza-size-relation/:id')
    async deletePizzaSizeRelation(@Param('id', ParseUUIDPipe) id: string) {
        return this.pizzaAdminService.deletePizzaSizeRelation(id);
    }

    // ==================== PIZZA ADDITIVE CRUD ====================
    @Get('pizza-additive')
    async getAllPizzaAdditives() {
        return this.pizzaAdminService.getAllPizzaAdditives();
    }

    @Get('pizza-additive/:id')
    async getOnePizzaAdditive(@Param('id', ParseUUIDPipe) id: string) {
        return this.pizzaAdminService.getOnePizzaAdditive(id);
    }

    @Post('pizza-additive')
    async createPizzaAdditive(
        @Body() createPizzaAdditiveDto: CreatePizzaAdditiveDto,
    ) {
        return this.pizzaAdminService.createPizzaAdditive(
            createPizzaAdditiveDto,
        );
    }

    @Put('pizza-additive/:id')
    async updatePizzaAdditive(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updatePizzaAdditiveDto: UpdatePizzaAdditiveDto,
    ) {
        return this.pizzaAdminService.updatePizzaAdditive(
            id,
            updatePizzaAdditiveDto,
        );
    }

    @Delete('pizza-additive/:id')
    async deletePizzaAdditive(@Param('id', ParseUUIDPipe) id: string) {
        return this.pizzaAdminService.deletePizzaAdditive(id);
    }

    // ==================== PIZZA ADDITIVE RELATION CRUD ====================
    @Get('pizza-additive-relation')
    async getAllPizzaAdditiveRelations() {
        return this.pizzaAdminService.getAllPizzaAdditiveRelations();
    }

    @Get('pizza-additive-relation/:id')
    async getOnePizzaAdditiveRelation(@Param('id', ParseUUIDPipe) id: string) {
        return this.pizzaAdminService.getOnePizzaAdditiveRelation(id);
    }

    @Post('pizza-additive-relation')
    async createPizzaAdditiveRelation(
        @Body() createPizzaAdditiveRelationDto: CreatePizzaAdditiveRelationDto,
    ) {
        return this.pizzaAdminService.createPizzaAdditiveRelation(
            createPizzaAdditiveRelationDto,
        );
    }

    @Put('pizza-additive-relation/:id')
    async updatePizzaAdditiveRelation(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updatePizzaAdditiveRelationDto: UpdatePizzaAdditiveRelationDto,
    ) {
        return this.pizzaAdminService.updatePizzaAdditiveRelation(
            id,
            updatePizzaAdditiveRelationDto,
        );
    }

    @Delete('pizza-additive-relation/:id')
    async deletePizzaAdditiveRelation(@Param('id', ParseUUIDPipe) id: string) {
        return this.pizzaAdminService.deletePizzaAdditiveRelation(id);
    }
}
