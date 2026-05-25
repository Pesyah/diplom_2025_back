import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/products/entities/products.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersItem } from './entities/orders-item.entity';
import { OrdersStatus } from './entities/orders-status.entity';
import { Orders } from './entities/orders.entity';

interface NormalizedOrderItem {
    productId: string;
    quantity: number;
}

export interface OrderItemView {
    id: string;
    productId: string;
    productName: string;
    unitPrice: number;
    price: number;
    quantity: number;
    total: number;
    product: Products | null;
}

export interface OrderResponse extends Orders {
    items: OrderItemView[];
    totalPrice: number;
    totalQuantity: number;
}

@Injectable()
export class OrdersService {
    private readonly cancelledStatusId = 5;

    constructor(
        @InjectRepository(Orders)
        private readonly ordersRepository: Repository<Orders>,
        @InjectRepository(OrdersItem)
        private readonly ordersItemRepository: Repository<OrdersItem>,
        @InjectRepository(OrdersStatus)
        private readonly ordersStatusRepository: Repository<OrdersStatus>,
        private readonly dataSource: DataSource,
    ) {}

    private async generateUniqueCode(): Promise<string> {
        let code: string;

        while (true) {
            code = Math.floor(100000 + Math.random() * 900000).toString();
            if (
                !(await this.ordersRepository.findOne({
                    where: { orderNumber: code },
                    select: ['id'],
                }))
            ) {
                return code;
            }
        }
    }

    private normalizeItems(items: CreateOrderDto['items']): NormalizedOrderItem[] {
        const itemsByProductId = new Map<string, number>();

        for (const item of items) {
            itemsByProductId.set(
                item.productId,
                (itemsByProductId.get(item.productId) ?? 0) + item.quantity,
            );
        }

        return Array.from(itemsByProductId, ([productId, quantity]) => ({
            productId,
            quantity,
        }));
    }

    private toMoneyNumber(value: number | string | null | undefined): number {
        return Number(value) || 0;
    }

    private getOrderRelations() {
        return {
            status: true,
            orderItem: {
                products: true,
            },
            customer: true,
            manager: true,
        };
    }

    private async findOrderWithRelations(
        orderId: string,
        manager?: EntityManager,
    ): Promise<Orders> {
        const repository = manager?.getRepository(Orders) ?? this.ordersRepository;
        const order = await repository.findOne({
            where: { id: orderId },
            relations: this.getOrderRelations(),
        });

        if (!order) {
            throw new NotFoundException(`Заказ с ID ${orderId} не найден`);
        }

        return order;
    }

    private mapOrder(order: Orders): OrderResponse {
        const orderItems = order.orderItem || [];
        const items = orderItems.map((item) => {
            const unitPrice = this.toMoneyNumber(item.unitPrice);
            const total = unitPrice * item.quantity;
            const product = item.products
                ? {
                      ...item.products,
                      price: this.toMoneyNumber(item.products.price),
                  }
                : null;

            return {
                id: item.id,
                productId: item.products?.id || '',
                productName: item.products?.name || 'Товар',
                unitPrice,
                price: unitPrice,
                quantity: item.quantity,
                total,
                product,
            };
        });

        return {
            ...order,
            items,
            totalPrice: items.reduce((sum, item) => sum + item.total, 0),
            totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
        };
    }

    private async getProductForStockUpdate(
        productId: string,
        manager: EntityManager,
    ): Promise<Products> {
        const product = await manager.findOne(Products, {
            where: { id: productId },
            lock: { mode: 'pessimistic_write' },
        });

        if (!product) {
            throw new NotFoundException(`Товар с ID ${productId} не найден`);
        }

        return product;
    }

    private async reserveProductStock(
        product: Products,
        quantity: number,
        manager: EntityManager,
    ): Promise<void> {
        if (product.stockQuantity < quantity) {
            throw new BadRequestException(
                `Недостаточно товара "${product.name}" на складе`,
            );
        }

        await manager.update(
            Products,
            { id: product.id },
            { stockQuantity: product.stockQuantity - quantity },
        );
    }

    private async reserveOrderStock(
        order: Orders,
        manager: EntityManager,
    ): Promise<void> {
        for (const item of order.orderItem || []) {
            const productId = item.products?.id;

            if (!productId) {
                throw new NotFoundException('Товар в заказе не найден');
            }

            const product = await this.getProductForStockUpdate(
                productId,
                manager,
            );
            await this.reserveProductStock(product, item.quantity, manager);
        }
    }

    private async releaseOrderStock(
        order: Orders,
        manager: EntityManager,
    ): Promise<void> {
        for (const item of order.orderItem || []) {
            const productId = item.products?.id;

            if (!productId) {
                throw new NotFoundException('Товар в заказе не найден');
            }

            await manager.increment(
                Products,
                { id: productId },
                'stockQuantity',
                item.quantity,
            );
        }
    }

    // USER METHODS
    async getUserOrders(userId: string): Promise<OrderResponse[]> {
        const orders = await this.ordersRepository.find({
            where: { customer: { id: userId } },
            relations: this.getOrderRelations(),
            order: { createdAt: 'DESC' },
        });

        return orders.map((order) => this.mapOrder(order));
    }

    async getUserOrderById(
        orderId: string,
        userId: string,
    ): Promise<OrderResponse> {
        const order = await this.findOrderWithRelations(orderId);

        if (order.customer.id !== userId) {
            throw new ForbiddenException(
                'Вы можете просматривать только свои заказы',
            );
        }

        return this.mapOrder(order);
    }

    async createOrder(
        userId: string,
        dto: CreateOrderDto,
    ): Promise<OrderResponse> {
        if (!dto.items || dto.items.length === 0) {
            throw new BadRequestException(
                'Заказ должен содержать хотя бы один товар',
            );
        }

        const orderNumber = await this.generateUniqueCode();
        const items = this.normalizeItems(dto.items);

        const order = await this.dataSource.transaction(async (manager) => {
            const defaultStatus = await manager.findOne(OrdersStatus, {
                where: { id: 1 },
            });

            if (!defaultStatus) {
                throw new NotFoundException(
                    'Статус "Оформлен" не найден в системе',
                );
            }

            const savedOrder = await manager.save(
                Orders,
                manager.create(Orders, {
                    orderNumber,
                    customer: { id: userId },
                    status: defaultStatus,
                    notes: dto.notes || undefined,
                }),
            );

            const orderItems: OrdersItem[] = [];

            for (const item of items) {
                const product = await this.getProductForStockUpdate(
                    item.productId,
                    manager,
                );

                await this.reserveProductStock(product, item.quantity, manager);

                orderItems.push(
                    manager.create(OrdersItem, {
                        orders: savedOrder,
                        products: product,
                        unitPrice: product.price,
                        quantity: item.quantity,
                    }),
                );
            }

            await manager.save(OrdersItem, orderItems);

            return this.findOrderWithRelations(savedOrder.id, manager);
        });

        return this.mapOrder(order);
    }

    // ADMIN METHODS
    async getAllOrders(): Promise<OrderResponse[]> {
        const orders = await this.ordersRepository.find({
            relations: this.getOrderRelations(),
            order: { createdAt: 'DESC' },
        });

        return orders.map((order) => this.mapOrder(order));
    }

    async getStatuses(): Promise<OrdersStatus[]> {
        return this.ordersStatusRepository.find({
            order: { id: 'ASC' },
        });
    }

    async getOrderById(orderId: string): Promise<OrderResponse> {
        const order = await this.findOrderWithRelations(orderId);
        return this.mapOrder(order);
    }

    async updateOrderStatus(
        orderId: string,
        dto: UpdateOrderStatusDto,
    ): Promise<OrderResponse> {
        const order = await this.dataSource.transaction(async (manager) => {
            const currentOrder = await this.findOrderWithRelations(
                orderId,
                manager,
            );
            const newStatus = await manager.findOne(OrdersStatus, {
                where: { id: dto.statusId },
            });

            if (!newStatus) {
                throw new NotFoundException(
                    `Статус с ID ${dto.statusId} не найден`,
                );
            }

            if (
                currentOrder.status.id !== this.cancelledStatusId &&
                newStatus.id === this.cancelledStatusId
            ) {
                await this.releaseOrderStock(currentOrder, manager);
            }

            if (
                currentOrder.status.id === this.cancelledStatusId &&
                newStatus.id !== this.cancelledStatusId
            ) {
                await this.reserveOrderStock(currentOrder, manager);
            }

            currentOrder.status = newStatus;

            if (dto.rejectMessage !== undefined) {
                currentOrder.rejectMessage = dto.rejectMessage;
            }

            await manager.save(Orders, currentOrder);
            return this.findOrderWithRelations(orderId, manager);
        });

        return this.mapOrder(order);
    }

    async deleteOrder(orderId: string): Promise<void> {
        await this.dataSource.transaction(async (manager) => {
            const order = await manager.findOne(Orders, {
                where: { id: orderId },
                relations: {
                    status: true,
                    orderItem: {
                        products: true,
                    },
                },
            });

            if (!order) {
                throw new NotFoundException(`Заказ с ID ${orderId} не найден`);
            }

            if (order.status.id !== this.cancelledStatusId) {
                await this.releaseOrderStock(order, manager);
            }

            if (order.orderItem && order.orderItem.length > 0) {
                await manager.remove(OrdersItem, order.orderItem);
            }

            await manager.remove(Orders, order);
        });
    }
}
