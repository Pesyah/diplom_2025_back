import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
    // TODO поиск бренда, обязательно(страница бренда с типами продуктов)
    // обычный поиск по названию модели
    // поиск но названия внутри бренда(что-то типа страницы как на dns)
    // по id обычный запрос
    // все выше для юзеров

    // TODO админ - отдельно запросы брендов их редактирование и создание
    // запросы продуктов по названиям по id и редактирование их(так же установить бренд\тип)
    // id для патч запросов передается только в бади, не передаем в param

    // TODO все апи по RESTFUL делаем, четко прописываем DTO с примерами
}
