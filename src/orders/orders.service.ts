import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../auth/entities/users.entity';
import { CoffeeAdditiveRelation } from '../coffee/entities/coffee-additive-relation.entity';
import { CoffeeVolumeRelation } from '../coffee/entities/coffee-volume-relation.entity';
import { Coffee } from '../coffee/entities/coffee.entity';
import { Products } from '../products/entities/product.entity';
import { CreateOrderItemAdminDto } from './dto/create-order-item.dto';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import { UpdateOrderAdminDto } from './dto/update-order-admin.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderStatus } from './entities/order-status.entity';
import { OrdersItems } from './entities/orders-items.entity';
import { Orders } from './entities/orders.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Orders)
        private readonly ordersRepo: Repository<Orders>,
        @InjectRepository(OrdersItems)
        private readonly itemsRepo: Repository<OrdersItems>,
        @InjectRepository(OrderStatus)
        private readonly statusRepo: Repository<OrderStatus>,
        @InjectRepository(Users)
        private readonly usersRepo: Repository<Users>,
        @InjectRepository(Coffee)
        private readonly coffeeRepo: Repository<Coffee>,
        @InjectRepository(CoffeeVolumeRelation)
        private readonly volumeRelationRepo: Repository<CoffeeVolumeRelation>,
        @InjectRepository(CoffeeAdditiveRelation)
        private readonly additiveRelationRepo: Repository<CoffeeAdditiveRelation>,
        @InjectRepository(Products)
        private readonly productsRepo: Repository<Products>,
    ) {}

    // ===================== USER =====================

    async createOrder(userId: string, dto: CreateOrderDto): Promise<Orders> {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        const initialStatus = await this.statusRepo.findOne({
            where: { id: 1 },
        });
        if (!initialStatus) {
            throw new NotFoundException('Статус по умолчанию не найден');
        }

        const order = this.ordersRepo.create({
            users: user,
            orderStatus: initialStatus,
            comment: dto.comment || '',
            totalValue: 0,
        });

        const savedOrder = await this.ordersRepo.save(order);

        let totalValue = 0;
        const items: OrdersItems[] = [];

        for (const itemDto of dto.items) {
            const itemTotal = await this.calculateItemTotal(itemDto);
            totalValue += itemTotal;

            // Get additive relations if provided
            let additiveRelations: any = [];
            if (itemDto.coffeeAdditiveRelationIds?.length) {
                additiveRelations = await this.additiveRelationRepo.findByIds(
                    itemDto.coffeeAdditiveRelationIds,
                );
            }

            const item = this.itemsRepo.create({
                orders: { id: savedOrder.id },
                products: itemDto.productsId
                    ? { id: itemDto.productsId }
                    : undefined,
                coffeeVolumeRelation: itemDto.coffeeVolumeRelationId
                    ? { id: itemDto.coffeeVolumeRelationId }
                    : undefined,
                coffeeAdditiveRelation: additiveRelations,
                quantity: itemDto.quantity,
                totalValue: itemTotal,
            });

            items.push(item);
        }

        await this.itemsRepo.save(items);

        savedOrder.totalValue = totalValue;
        return this.ordersRepo.save(savedOrder);
    }

    async findByUser(userId: string): Promise<Orders[]> {
        return this.ordersRepo.find({
            where: { users: { id: userId } },
            relations: {
                orderStatus: true,
                ordersItems: {
                    products: { productsCategory: true },
                    coffeeVolumeRelation: {
                        coffee: true,
                        coffeeVolume: true,
                    },
                    coffeeAdditiveRelation: {
                        coffeeVolumeRelation: {
                            coffee: true,
                            coffeeVolume: true,
                        },
                        coffeeAdditive: true,
                    },
                },
            },
            order: { id: 'DESC' },
        });
    }

    async findByIdForUser(userId: string, orderId: string): Promise<Orders> {
        const order = await this.ordersRepo.findOne({
            where: { id: orderId, users: { id: userId } },
            relations: {
                orderStatus: true,
                ordersItems: {
                    products: { productsCategory: true },
                    coffeeVolumeRelation: {
                        coffee: true,
                        coffeeVolume: true,
                    },
                    coffeeAdditiveRelation: {
                        coffeeVolumeRelation: {
                            coffee: true,
                            coffeeVolume: true,
                        },
                        coffeeAdditive: true,
                    },
                },
            },
        });
        if (!order) {
            throw new NotFoundException('Заказ не найден');
        }
        return order;
    }

    async cancelOrder(userId: string, orderId: string): Promise<Orders> {
        const order = await this.ordersRepo.findOne({
            where: { id: orderId, users: { id: userId } },
            relations: { orderStatus: true },
        });

        if (!order) {
            throw new NotFoundException('Заказ не найден');
        }

        if (order.orderStatus.id !== 1) {
            throw new BadRequestException(
                'Можно отменить заказ только со статусом "Не начат"',
            );
        }

        const cancelledStatus = await this.statusRepo.findOne({
            where: { id: 5 },
        });
        if (!cancelledStatus) {
            throw new NotFoundException('Статус "Отменён" не найден');
        }

        order.orderStatus = cancelledStatus;
        return this.ordersRepo.save(order);
    }

    // ===================== ADMIN =====================

    async findAllAdmin(): Promise<Orders[]> {
        return this.ordersRepo.find({
            relations: {
                users: true,
                orderStatus: true,
                ordersItems: {
                    products: { productsCategory: true },
                    coffeeVolumeRelation: {
                        coffee: true,
                        coffeeVolume: true,
                    },
                    coffeeAdditiveRelation: {
                        coffeeVolumeRelation: {
                            coffee: true,
                            coffeeVolume: true,
                        },
                        coffeeAdditive: true,
                    },
                },
            },
            order: { id: 'DESC' },
        });
    }

    async findByIdAdmin(orderId: string): Promise<Orders> {
        const order = await this.ordersRepo.findOne({
            where: { id: orderId },
            relations: {
                users: true,
                orderStatus: true,
                ordersItems: {
                    products: { productsCategory: true },
                    coffeeVolumeRelation: {
                        coffee: true,
                        coffeeVolume: true,
                    },
                    coffeeAdditiveRelation: {
                        coffeeVolumeRelation: {
                            coffee: true,
                            coffeeVolume: true,
                        },
                        coffeeAdditive: true,
                    },
                },
            },
        });
        if (!order) {
            throw new NotFoundException('Заказ не найден');
        }
        return order;
    }

    async findByUserAdmin(userId: string): Promise<Orders[]> {
        return this.ordersRepo.find({
            where: { users: { id: userId } },
            relations: {
                orderStatus: true,
                ordersItems: {
                    products: { productsCategory: true },
                    coffeeVolumeRelation: {
                        coffee: true,
                        coffeeVolume: true,
                    },
                    coffeeAdditiveRelation: {
                        coffeeVolumeRelation: {
                            coffee: true,
                            coffeeVolume: true,
                        },
                        coffeeAdditive: true,
                    },
                },
            },
            order: { id: 'DESC' },
        });
    }

    async updateStatus(dto: UpdateOrderAdminDto): Promise<Orders> {
        const order = await this.ordersRepo.findOne({
            where: { id: dto.id },
        });
        if (!order) {
            throw new NotFoundException('Заказ не найден');
        }

        const newStatus = await this.statusRepo.findOne({
            where: { id: dto.orderStatusId },
        });
        if (!newStatus) {
            throw new NotFoundException(
                `Статус с id ${dto.orderStatusId} не найден`,
            );
        }

        order.orderStatus = newStatus;
        return this.ordersRepo.save(order);
    }

    async addItem(dto: CreateOrderItemAdminDto): Promise<OrdersItems> {
        const order = await this.ordersRepo.findOne({
            where: { id: dto.orderId },
        });
        if (!order) {
            throw new NotFoundException('Заказ не найден');
        }

        const itemDto: CreateOrderItemDto = {
            productsId: dto.productsId,
            coffeeVolumeRelationId: dto.coffeeVolumeRelationId,
            coffeeAdditiveRelationIds: dto.coffeeAdditiveRelationIds,
            quantity: dto.quantity,
        };

        const itemTotal = await this.calculateItemTotal(itemDto);

        // Get additive relations if provided
        let additiveRelations: any = [];
        if (dto.coffeeAdditiveRelationIds?.length) {
            additiveRelations = await this.additiveRelationRepo.findByIds(
                dto.coffeeAdditiveRelationIds,
            );
        }

        const item = this.itemsRepo.create({
            orders: { id: dto.orderId },
            products: dto.productsId ? { id: dto.productsId } : undefined,
            coffeeVolumeRelation: dto.coffeeVolumeRelationId
                ? { id: dto.coffeeVolumeRelationId }
                : undefined,
            coffeeAdditiveRelation: additiveRelations,
            quantity: dto.quantity,
            totalValue: itemTotal,
        });

        const savedItem = await this.itemsRepo.save(item);
        await this.recalculateOrderTotal(dto.orderId);
        return savedItem;
    }

    async updateItem(dto: UpdateOrderItemDto): Promise<OrdersItems> {
        const item = await this.itemsRepo.findOne({
            where: { id: dto.id },
            relations: [
                'orders',
                'products',
                'coffeeVolumeRelation',
                'coffeeAdditiveRelation',
            ],
        });
        if (!item) {
            throw new NotFoundException('Позиция заказа не найдена');
        }

        item.quantity = dto.quantity;

        // Preserve existing additive relations since we're only updating quantity
        const itemDto: CreateOrderItemDto = {
            productsId: item.products?.id,
            coffeeVolumeRelationId: item.coffeeVolumeRelation?.id,
            coffeeAdditiveRelationIds: item.coffeeAdditiveRelation?.map(
                (rel) => rel.id,
            ),
            quantity: dto.quantity,
        };

        item.totalValue = await this.calculateItemTotal(itemDto);

        const savedItem = await this.itemsRepo.save(item);
        await this.recalculateOrderTotal(item.orders.id);
        return savedItem;
    }

    async deleteItem(itemId: string): Promise<void> {
        const item = await this.itemsRepo.findOne({
            where: { id: itemId },
            relations: ['orders'],
        });
        if (!item) {
            throw new NotFoundException('Позиция заказа не найдена');
        }

        const orderId = item.orders.id;
        await this.itemsRepo.delete(itemId);
        await this.recalculateOrderTotal(orderId);
    }

    // ===================== HELPERS =====================

    private async calculateItemTotal(dto: CreateOrderItemDto): Promise<number> {
        let basePrice = 0;

        if (dto.productsId) {
            const product = await this.productsRepo.findOne({
                where: { id: dto.productsId },
            });
            if (!product) {
                throw new NotFoundException(
                    `Продукт с id ${dto.productsId} не найден`,
                );
            }
            basePrice = Number(product.price);
        } else if (dto.coffeeVolumeRelationId) {
            const volumeRel = await this.volumeRelationRepo.findOne({
                where: { id: dto.coffeeVolumeRelationId },
            });
            if (!volumeRel) {
                throw new NotFoundException(
                    `Связь объема с id ${dto.coffeeVolumeRelationId} не найдена`,
                );
            }
            basePrice = Number(volumeRel.price);

            // Sum up all additives
            if (dto.coffeeAdditiveRelationIds?.length) {
                const additiveRels = await this.additiveRelationRepo.findByIds(
                    dto.coffeeAdditiveRelationIds,
                );

                for (const additiveRel of additiveRels) {
                    basePrice += Number(additiveRel.price);
                }
            }
        } else {
            throw new BadRequestException(
                'Должен быть указан productsId или coffeeVolumeRelationId',
            );
        }

        return basePrice * dto.quantity;
    }

    private async recalculateOrderTotal(orderId: string): Promise<void> {
        const items = await this.itemsRepo.find({
            where: { orders: { id: orderId } },
        });

        const total = items.reduce(
            (sum, item) => sum + Number(item.totalValue),
            0,
        );
        await this.ordersRepo.update(orderId, { totalValue: total });
    }
}
