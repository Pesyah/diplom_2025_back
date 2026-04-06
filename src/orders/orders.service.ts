// orders.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { PizzaAdditiveRelation } from 'src/pizza/entities/pizza-additive-relations.entity';
import { PizzaSizeRelation } from 'src/pizza/entities/pizza-size-relations.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { OrdersParts } from './entities/order-part.entity';
import { OrderStatus } from './entities/order-status.entity';
import { Orders } from './entities/order.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Orders)
        private readonly ordersRepository: Repository<Orders>,
        @InjectRepository(OrdersParts)
        private readonly ordersPartsRepository: Repository<OrdersParts>,
        @InjectRepository(OrderStatus)
        private readonly orderStatusRepository: Repository<OrderStatus>,
        @InjectRepository(PizzaSizeRelation)
        private readonly pizzaSizeRelationRepository: Repository<PizzaSizeRelation>,
        @InjectRepository(PizzaAdditiveRelation)
        private readonly pizzaAdditiveRelationRepository: Repository<PizzaAdditiveRelation>,
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
    ) {}

    async allRelations() {
        return { orderStatus: await this.orderStatusRepository.find() };
    }

    async createOrder(createOrderDto: CreateOrderDto, userId: string) {
        // 1. Проверяем пользователя
        const user = await this.usersRepository.findOneBy({ id: userId });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        // 2. Статус по умолчанию "Ожидает подтверждения" (id: 1)
        const defaultStatus = await this.orderStatusRepository.findOneBy({
            id: 1,
        });
        if (!defaultStatus) {
            throw new HttpException(
                'Default order status not found',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        // 3. Создаем заказ
        const order = this.ordersRepository.create({
            users: user,
            orderStatus: defaultStatus,
        });

        await this.ordersRepository.save(order);

        // 4. Создаем части заказа
        const orderParts: OrdersParts[] = [];

        for (const item of createOrderDto.items) {
            // Проверяем пиццу с размером
            const pizzaSizeRelation =
                await this.pizzaSizeRelationRepository.findOne({
                    where: { id: item.pizzaSizeRelationId },
                    relations: ['pizza', 'pizzaSize'],
                });

            if (!pizzaSizeRelation) {
                throw new HttpException(
                    `Pizza size relation with id ${item.pizzaSizeRelationId} not found`,
                    HttpStatus.NOT_FOUND,
                );
            }

            // Проверяем добавки
            const additives: PizzaAdditiveRelation[] = [];
            let additivesPrice = 0;

            if (item.additiveIds && item.additiveIds.length > 0) {
                for (const additiveId of item.additiveIds) {
                    const additiveRelation =
                        await this.pizzaAdditiveRelationRepository.findOne({
                            where: { id: additiveId },
                            relations: ['pizzaAdditive', 'pizzaSizeRelation'],
                        });

                    if (!additiveRelation) {
                        throw new HttpException(
                            `Additive relation with id ${additiveId} not found`,
                            HttpStatus.NOT_FOUND,
                        );
                    }

                    // Проверяем, что добавка относится к этой пицце
                    if (
                        additiveRelation.pizzaSizeRelation.id !==
                        pizzaSizeRelation.id
                    ) {
                        throw new HttpException(
                            `Additive ${additiveRelation.pizzaAdditive.name} is not available for this pizza size`,
                            HttpStatus.BAD_REQUEST,
                        );
                    }

                    additives.push(additiveRelation);

                    if (additiveRelation.isAdd) {
                        additivesPrice += additiveRelation.price;
                    }
                }
            }

            // Рассчитываем цену
            const pizzaPrice = pizzaSizeRelation.price + additivesPrice;

            const orderPart = this.ordersPartsRepository.create({
                orders: order,
                pizzaSizeRelation: pizzaSizeRelation,
                pizzaAdditiveRelations: additives,
                count: item.count,
                priceAtTime: pizzaPrice,
            });

            orderParts.push(orderPart);
        }

        // 5. Сохраняем части заказа
        await this.ordersPartsRepository.save(orderParts);

        // 6. Возвращаем созданный заказ
        return this.getOrderById(order.id);
    }

    async getOrderById(id: string) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: {
                users: true,
                orderStatus: true,
                ordersParts: {
                    pizzaSizeRelation: {
                        pizza: true,
                        pizzaSize: true,
                    },
                    pizzaAdditiveRelations: {
                        pizzaAdditive: true,
                    },
                },
            },
        });

        if (!order) {
            throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
        }

        return order;
    }

    async getAllOrders(page = 1, limit = 20) {
        const [orders, total] = await this.ordersRepository.findAndCount({
            relations: {
                users: true,
                orderStatus: true,
                ordersParts: {
                    pizzaSizeRelation: {
                        pizza: true,
                        pizzaSize: true,
                    },
                },
            },
            order: {
                createdAt: 'DESC',
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data: orders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getUserOrders(userId: string, page = 1, limit = 20) {
        const [orders, total] = await this.ordersRepository.findAndCount({
            where: { users: { id: userId } },
            relations: {
                orderStatus: true,
                ordersParts: {
                    pizzaSizeRelation: {
                        pizza: true,
                        pizzaSize: true,
                    },
                    pizzaAdditiveRelations: {
                        pizzaAdditive: true,
                    },
                },
            },
            order: {
                createdAt: 'DESC',
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data: orders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async updateOrderStatus(
        id: string,
        updateOrderStatusDto: UpdateOrderStatusDto,
    ) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['orderStatus'],
        });

        if (!order) {
            throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
        }

        const newStatus = await this.orderStatusRepository.findOneBy({
            id: updateOrderStatusDto.statusId,
        });

        if (!newStatus) {
            throw new HttpException(
                'Order status not found',
                HttpStatus.NOT_FOUND,
            );
        }

        order.orderStatus = newStatus;
        await this.ordersRepository.save(order);

        return this.getOrderById(id);
    }

    async cancelOrder(id: string, userId: string, isAdmin = false) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['users', 'orderStatus'],
        });

        if (!order) {
            throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
        }

        // Проверка прав
        if (!isAdmin && order.users.id !== userId) {
            throw new HttpException(
                'You can only cancel your own orders',
                HttpStatus.FORBIDDEN,
            );
        }

        const cancelledStatus = await this.orderStatusRepository.findOneBy({
            id: 6,
        });
        if (!cancelledStatus)
            throw new HttpException(
                'cancelledStatus not found',
                HttpStatus.NOT_FOUND,
            );
        const deliveredStatus = await this.orderStatusRepository.findOneBy({
            id: 5,
        });

        if (order.orderStatus.id === deliveredStatus?.id) {
            throw new HttpException(
                'Cannot cancel delivered order',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (order.orderStatus.id === cancelledStatus?.id) {
            throw new HttpException(
                'Order is already cancelled',
                HttpStatus.BAD_REQUEST,
            );
        }

        order.orderStatus = cancelledStatus;
        await this.ordersRepository.save(order);

        return this.getOrderById(id);
    }

    async getOrderStats() {
        const totalOrders = await this.ordersRepository.count();

        const stats = await this.ordersRepository
            .createQueryBuilder('order')
            .select('orderStatus.id', 'statusId')
            .addSelect('orderStatus.name', 'statusName')
            .addSelect('COUNT(order.id)', 'count')
            .leftJoin('order.orderStatus', 'orderStatus')
            .groupBy('orderStatus.id')
            .addGroupBy('orderStatus.name')
            .getRawMany();

        return {
            totalOrders,
            stats,
        };
    }
}
