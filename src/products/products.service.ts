import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsCategory } from './entities/product-category.entity';
import { Products } from './entities/product.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Products)
        private readonly productsRepo: Repository<Products>,
        @InjectRepository(ProductsCategory)
        private readonly categoryRepo: Repository<ProductsCategory>,
    ) {}

    // ===================== PRODUCTS =====================

    async findAllActive(): Promise<Products[]> {
        return this.productsRepo.find({
            where: { deleted_at: IsNull() },
            relations: ['productsCategory'],
        });
    }

    async findById(id: string): Promise<Products> {
        const product = await this.productsRepo.findOne({
            where: { id, deleted_at: IsNull() },
            relations: ['productsCategory'],
        });
        if (!product) {
            throw new NotFoundException(`Продукт с id ${id} не найден`);
        }
        return product;
    }

    async findAllAdmin(): Promise<Products[]> {
        return this.productsRepo.find({
            relations: ['productsCategory'],
            withDeleted: true,
        });
    }

    async findDeletedAdmin(): Promise<Products[]> {
        return this.productsRepo.find({
            where: { deleted_at: Not(IsNull()) },
            relations: ['productsCategory'],
            withDeleted: true,
        });
    }

    async create(dto: CreateProductDto): Promise<Products> {
        const category = await this.categoryRepo.findOne({
            where: { id: dto.productsCategoryId },
        });
        if (!category) {
            throw new NotFoundException(
                `Категория с id ${dto.productsCategoryId} не найдена`,
            );
        }

        const product = this.productsRepo.create({
            name: dto.name,
            description: dto.description,
            productsCategory: category,
            price: dto.price,
        });
        return this.productsRepo.save(product);
    }

    async update(dto: UpdateProductDto): Promise<Products> {
        const product = await this.productsRepo.findOne({
            where: { id: dto.id, deleted_at: IsNull() },
        });
        if (!product) {
            throw new NotFoundException(`Продукт с id ${dto.id} не найден`);
        }

        if (dto.name !== undefined) product.name = dto.name;
        if (dto.description !== undefined)
            product.description = dto.description;
        if (dto.price !== undefined) product.price = dto.price;

        if (dto.productsCategoryId !== undefined) {
            const category = await this.categoryRepo.findOne({
                where: { id: dto.productsCategoryId },
            });
            if (!category) {
                throw new NotFoundException(
                    `Категория с id ${dto.productsCategoryId} не найдена`,
                );
            }
            product.productsCategory = category;
        }

        return this.productsRepo.save(product);
    }

    async softDelete(id: string): Promise<void> {
        const result = await this.productsRepo.softDelete(id);
        if (!result.affected) {
            throw new NotFoundException(`Продукт с id ${id} не найден`);
        }
    }

    async restore(id: string): Promise<void> {
        const result = await this.productsRepo.restore(id);
        if (!result.affected) {
            throw new NotFoundException(`Продукт с id ${id} не найден`);
        }
    }

    // ===================== CATEGORIES =====================

    async findAllCategories(): Promise<ProductsCategory[]> {
        return this.categoryRepo.find();
    }

    async createCategory(
        dto: CreateProductCategoryDto,
    ): Promise<ProductsCategory> {
        const existing = await this.categoryRepo.findOne({
            where: { name: dto.name },
        });
        if (existing) {
            throw new ConflictException(
                `Категория с id ${existing.name} уже существует`,
            );
        }
        const category = this.categoryRepo.create(dto);
        return this.categoryRepo.save(category);
    }

    async updateCategory(
        dto: UpdateProductCategoryDto,
    ): Promise<ProductsCategory> {
        const category = await this.categoryRepo.findOne({
            where: { id: dto.id },
        });
        if (!category) {
            throw new NotFoundException(`Категория с id ${dto.id} не найдена`);
        }
        category.name = dto.name;
        return this.categoryRepo.save(category);
    }

    async deleteCategory(id: number): Promise<void> {
        const result = await this.categoryRepo.delete(id);
        if (!result.affected) {
            throw new NotFoundException(`Категория с id ${id} не найдена`);
        }
    }
}
