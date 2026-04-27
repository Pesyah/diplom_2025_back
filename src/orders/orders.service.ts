import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/products/entities/products.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersItem } from './entities/orders-item.entity';
import { OrdersStatus } from './entities/orders-status.entity';
import { Orders } from './entities/orders.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Orders)
        private readonly ordersRepository: Repository<Orders>,
        @InjectRepository(OrdersItem)
        private readonly ordersItemRepository: Repository<OrdersItem>,
        @InjectRepository(OrdersStatus)
        private readonly ordersStatusRepository: Repository<OrdersStatus>,
        @InjectRepository(Products)
        private readonly productsRepository: Repository<Products>,
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
            )
                return code;
        }
    }

    // USER METHODS
    async getUserOrders(userId: string): Promise<Orders[]> {
        return this.ordersRepository.find({
            where: { customer: { id: userId } },
            relations: {
                status: true,
                orderItem: {
                    products: true,
                },
                customer: true,
            },
            order: { createdAt: 'DESC' },
        });
    }

    async getUserOrderById(orderId: string, userId: string): Promise<Orders> {
        const order = await this.ordersRepository.findOne({
            where: { id: orderId },
            relations: {
                status: true,
                orderItem: {
                    products: true,
                },
                customer: true,
                manager: true,
            },
        });

        if (!order) {
            throw new NotFoundException(`Заказ с ID ${orderId} не найден`);
        }

        if (order.customer.id !== userId) {
            throw new ForbiddenException(
                'Вы можете просматривать только свои заказы',
            );
        }

        return order;
    }

    async createOrder(userId: string, dto: CreateOrderDto) {
        if (!dto.items || dto.items.length === 0) {
            throw new BadRequestException(
                'Заказ должен содержать хотя бы один товар',
            );
        }

        const orderNumber = await this.generateUniqueCode();

        // Получаем статус "Оформлен"
        const defaultStatus = await this.ordersStatusRepository.findOne({
            where: { id: 1 },
        });

        if (!defaultStatus) {
            throw new NotFoundException(
                'Статус "Оформлен" не найден в системе',
            );
        }

        // Создаём заказ
        const order: Orders = this.ordersRepository.create({
            orderNumber,
            customer: { id: userId },
            status: defaultStatus,
            notes: dto.notes || undefined,
        });

        const savedOrder = await this.ordersRepository.save(order);

        // Создаём позиции заказа
        const orderItems: OrdersItem[] = [];

        for (const itemDto of dto.items) {
            const product = await this.productsRepository.findOne({
                where: { id: itemDto.productId },
            });

            if (!product) {
                throw new NotFoundException(
                    `Продукт с ID ${itemDto.productId} не найден`,
                );
            }

            const orderItem = this.ordersItemRepository.create({
                orders: savedOrder,
                products: product,
                unitPrice: product.price,
                quantity: itemDto.quantity,
            });

            orderItems.push(orderItem);
        }

        await this.ordersItemRepository.save(orderItems);

        // Возвращаем заказ с релейшенами
        return this.ordersRepository.findOne({
            where: { id: savedOrder.id },
            relations: {
                status: true,
                orderItem: {
                    products: true,
                },
                customer: true,
            },
        });
    }

    // ADMIN METHODS
    async getAllOrders(): Promise<Orders[]> {
        return this.ordersRepository.find({
            relations: {
                status: true,
                orderItem: {
                    products: true,
                },
                customer: true,
                manager: true,
            },
            order: { createdAt: 'DESC' },
        });
    }

    async getOrderById(orderId: string): Promise<Orders> {
        const order = await this.ordersRepository.findOne({
            where: { id: orderId },
            relations: {
                status: true,
                orderItem: {
                    products: true,
                },
                customer: true,
                manager: true,
            },
        });

        if (!order) {
            throw new NotFoundException(`Заказ с ID ${orderId} не найден`);
        }

        return order;
    }

    async updateOrderStatus(
        orderId: string,
        dto: UpdateOrderStatusDto,
    ): Promise<Orders> {
        const order = await this.ordersRepository.findOne({
            where: { id: orderId },
            relations: {
                status: true,
                orderItem: {
                    products: true,
                },
                customer: true,
                manager: true,
            },
        });

        if (!order) {
            throw new NotFoundException(`Заказ с ID ${orderId} не найден`);
        }

        const newStatus = await this.ordersStatusRepository.findOne({
            where: { id: dto.statusId },
        });

        if (!newStatus) {
            throw new NotFoundException(
                `Статус с ID ${dto.statusId} не найден`,
            );
        }

        order.status = newStatus;

        // rejectMessage опционален для любого статуса
        if (dto.rejectMessage !== undefined) {
            order.rejectMessage = dto.rejectMessage;
        }

        return this.ordersRepository.save(order);
    }

    async deleteOrder(orderId: string): Promise<void> {
        // Проверяем существование заказа
        const order = await this.ordersRepository.findOne({
            where: { id: orderId },
            relations: {
                orderItem: true,
            },
        });

        if (!order) {
            throw new NotFoundException(`Заказ с ID ${orderId} не найден`);
        }

        // Удаляем связанные позиции заказа
        if (order.orderItem && order.orderItem.length > 0) {
            await this.ordersItemRepository.remove(order.orderItem);
        }

        // Удаляем заказ
        await this.ordersRepository.remove(order);
    }
}
