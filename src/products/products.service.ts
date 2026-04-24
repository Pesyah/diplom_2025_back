import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Producers } from './entities/producers.entity';
import { ProductsCategory } from './entities/products-category.entity';
import { Products } from './entities/products.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Producers)
        private readonly producersRepository: Repository<Producers>,
        @InjectRepository(Products)
        private readonly productsRepository: Repository<Products>,
        @InjectRepository(ProductsCategory)
        private readonly productsCategoryRepository: Repository<ProductsCategory>,
    ) {}
    async brands(query: string) {
        return await this.producersRepository.find({
            where: { name: ILike(`%${query}%`) },
        });
    }
}
