import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Orders } from './entities/orders.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Orders)
        private readonly ordersRepository: Repository<Orders>,
    ) {}

    private async generateUniqueCode() {
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
    create(createOrderDto: CreateOrderDto) {
        return 'This action adds a new order';
    }

    findAll() {
        return `This action returns all orders`;
    }

    findOne(id: number) {
        return `This action returns a #${id} order`;
    }

    update(id: number, updateOrderDto: UpdateOrderDto) {
        return `This action updates a #${id} order`;
    }

    remove(id: number) {
        return `This action removes a #${id} order`;
    }
}
