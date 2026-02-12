import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';
import { ProductsPriceHistory } from './products-price-history.entity';
import { Products } from './products.entity';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Products> {
    listenTo() {
        return Products;
    }

    async afterUpdate(event: UpdateEvent<Products>) {
        // Проверяем, изменилась ли цена
        if (
            event.entity &&
            event.databaseEntity &&
            event.entity.price !== event.databaseEntity.price
        ) {
            const product = event.entity;

            // Создаем запись в истории цен
            const priceHistoryRepository =
                event.manager.getRepository<ProductsPriceHistory>(
                    ProductsPriceHistory,
                );

            const priceHistory = priceHistoryRepository.create({
                products: { id: product.id },
                price: product.price,
            });

            await priceHistoryRepository.save(priceHistory);
        }
    }

    async afterInsert(event: InsertEvent<Products>) {
        // При создании товара также сохраняем начальную цену
        const product = event.entity;

        const priceHistoryRepository =
            event.manager.getRepository<ProductsPriceHistory>(
                ProductsPriceHistory,
            );

        const priceHistory = priceHistoryRepository.create({
            products: { id: product.id },
            price: product.price,
        });

        await priceHistoryRepository.save(priceHistory);

        console.log(
            `Создан товар ${product.id} с начальной ценой ${product.price}`,
        );
    }
}
