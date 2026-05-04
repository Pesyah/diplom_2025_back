import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseSearchDto } from 'src/common/dto/base-search.dto';
import { ILike, In, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProducerDto } from './dto/create-producer.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { DeleteProducerDto } from './dto/delete-producer.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { GetAdminProductsByQueryDto } from './dto/get-admin-products-by-query.dto';
import { GetProductsByQueryDto } from './dto/get-products-by-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Producers } from './entities/producers.entity';
import { ProductsCategory } from './entities/products-category.entity';
import { Products } from './entities/products.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Products)
        private readonly productsRepository: Repository<Products>,
        @InjectRepository(Producers)
        private readonly producersRepository: Repository<Producers>,
        @InjectRepository(ProductsCategory)
        private readonly productsCategoryRepository: Repository<ProductsCategory>,
    ) {}

    async allRelations() {
        return {
            producers: await this.producersRepository.find(),
            productsCategory: await this.productsCategoryRepository.find(),
        };
    }

    async findProductsByQuery(dto: GetProductsByQueryDto) {
        const { search, brandId, categoryId, page = 1, limit = 20 } = dto;
        const queryBuilder = this.productsRepository
            .createQueryBuilder('products')
            .leftJoinAndSelect('products.producers', 'producers')
            .leftJoinAndSelect('products.productsCategory', 'productsCategory');

        if (search) {
            queryBuilder.andWhere('products.name ILIKE :search', {
                search: `%${search}%`,
            });
        }

        if (brandId && brandId.length > 0) {
            queryBuilder.andWhere('producers.id IN (:...brandId)', { brandId });
        }

        if (categoryId && categoryId.length > 0) {
            queryBuilder
                .innerJoin('products.productsCategory', 'categoryFilter')
                .andWhere('categoryFilter.id IN (:...categoryId)', {
                    categoryId,
                });
        }

        queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('products.createdAt', 'DESC');

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findAdminProducts(dto: GetAdminProductsByQueryDto) {
        const { search, brandId, categoryId, page = 1, limit = 20 } = dto;
        const queryBuilder = this.productsRepository
            .createQueryBuilder('products')
            .leftJoinAndSelect('products.producers', 'producers')
            .leftJoinAndSelect('products.productsCategory', 'productsCategory');

        if (search) {
            queryBuilder.andWhere('products.name ILIKE :search', {
                search: `%${search}%`,
            });
        }

        if (brandId && brandId.length > 0) {
            queryBuilder.andWhere('producers.id IN (:...brandId)', { brandId });
        }

        if (categoryId && categoryId.length > 0) {
            queryBuilder
                .innerJoin('products.productsCategory', 'categoryFilter')
                .andWhere('categoryFilter.id IN (:...categoryId)', {
                    categoryId,
                });
        }

        queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('products.createdAt', 'DESC');

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findProductById(id: string) {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: {
                producers: true,
                productsCategory: true,
            },
        });

        if (!product) {
            throw new NotFoundException('Продукт не найден');
        }

        return product;
    }

    async findBrandWithProducts(
        brandId: number,
        search?: string,
        page = 1,
        limit = 20,
    ) {
        const brand = await this.producersRepository.findOne({
            where: { id: brandId },
        });

        if (!brand) {
            throw new NotFoundException('Бренд не найден');
        }

        const categories = await this.productsCategoryRepository
            .createQueryBuilder('category')
            .innerJoin(
                'products_and_products_category',
                'pc',
                'pc.productsCategoryId = category.id',
            )
            .innerJoin('products', 'p', 'p.id = pc.productsId')
            .where('p.producersId = :brandId', { brandId })
            .distinct(true)
            .getMany();

        const productsWhere: any = {
            producers: { id: brandId },
        };

        if (search) {
            productsWhere.name = ILike(`%${search}%`);
        }

        const [products, total] = await this.productsRepository.findAndCount({
            where: productsWhere,
            relations: {
                producers: true,
                productsCategory: true,
            },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return {
            brand,
            categories,
            products: {
                data: products,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async createProduct(dto: CreateProductDto) {
        const producer = await this.producersRepository.findOne({
            where: { id: dto.producersId },
        });

        if (!producer) {
            throw new NotFoundException('Бренд не найден');
        }

        const categories = await this.productsCategoryRepository.findBy({
            id: In(dto.productsCategoryIds),
        });

        if (categories.length !== dto.productsCategoryIds.length) {
            throw new NotFoundException(
                'Одна или несколько категорий не найдены',
            );
        }

        const product = this.productsRepository.create({
            ...dto,
            producers: producer,
            productsCategory: categories,
        });

        return this.productsRepository.save(product);
    }

    async updateProduct(dto: UpdateProductDto) {
        const { id, producersId, productsCategoryIds, ...updateData } = dto;
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: {
                producers: true,
                productsCategory: true,
            },
        });

        if (!product) {
            throw new NotFoundException('Продукт не найден');
        }

        if (producersId) {
            const producer = await this.producersRepository.findOne({
                where: { id: producersId },
            });
            if (!producer) {
                throw new NotFoundException('Бренд не найден');
            }
            product.producers = producer;
        }

        if (productsCategoryIds) {
            const categories = await this.productsCategoryRepository.findBy({
                id: In(productsCategoryIds),
            });
            if (categories.length !== productsCategoryIds.length) {
                throw new NotFoundException(
                    'Одна или несколько категорий не найдены',
                );
            }
            product.productsCategory = categories;
        }

        Object.assign(product, updateData);
        return this.productsRepository.save(product);
    }

    async deleteProduct(dto: DeleteProductDto) {
        const product = await this.productsRepository.findOne({
            where: { id: dto.id },
        });

        if (!product) {
            throw new NotFoundException('Продукт не найден');
        }

        await this.productsRepository.softRemove(product);
        return { success: true, message: 'Продукт удалён' };
    }

    async findAdminBrands(dto: BaseSearchDto) {
        const { search, page = 1, limit = 20 } = dto;
        const where: any = {};

        if (search) {
            where.name = ILike(`%${search}%`);
        }

        const [data, total] = await this.producersRepository.findAndCount({
            where,
            skip: (page - 1) * limit,
            take: limit,
            order: { name: 'ASC' },
        });

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findAdminBrandById(id: number, page = 1, limit = 20) {
        const brand = await this.producersRepository.findOne({
            where: { id },
        });

        if (!brand) {
            throw new NotFoundException('Бренд не найден');
        }

        const categories = await this.productsCategoryRepository
            .createQueryBuilder('category')
            .innerJoin(
                'products_and_products_category',
                'pc',
                'pc.productsCategoryId = category.id',
            )
            .innerJoin('products', 'p', 'p.id = pc.productsId')
            .where('p.producersId = :brandId', { brandId: id })
            .distinct(true)
            .getMany();

        const [products, total] = await this.productsRepository.findAndCount({
            where: { producers: { id } },
            relations: {
                productsCategory: true,
            },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return {
            brand,
            categories,
            products: {
                data: products,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async createProducer(dto: CreateProducerDto) {
        const producer = this.producersRepository.create(dto);
        return this.producersRepository.save(producer);
    }

    async updateProducer(dto: UpdateProducerDto) {
        const { id, ...updateData } = dto;
        const producer = await this.producersRepository.findOne({
            where: { id },
        });

        if (!producer) {
            throw new NotFoundException('Бренд не найден');
        }

        Object.assign(producer, updateData);
        return this.producersRepository.save(producer);
    }

    async deleteProducer(dto: DeleteProducerDto) {
        const producer = await this.producersRepository.findOne({
            where: { id: dto.id },
        });

        if (!producer) {
            throw new NotFoundException('Бренд не найден');
        }

        await this.producersRepository.remove(producer);
        return { success: true, message: 'Бренд удалён' };
    }

    async findAdminCategories(dto: BaseSearchDto) {
        const { search, page = 1, limit = 20 } = dto;
        const where: any = {};

        if (search) {
            where.name = ILike(`%${search}%`);
        }

        const [data, total] =
            await this.productsCategoryRepository.findAndCount({
                where,
                skip: (page - 1) * limit,
                take: limit,
                order: { name: 'ASC' },
            });

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findAdminCategoriesById(id: number, page = 1, limit = 20) {
        const category = await this.productsCategoryRepository.findOne({
            where: { id },
        });

        if (!category) {
            throw new NotFoundException('Категория не найдена');
        }

        const brands = await this.producersRepository
            .createQueryBuilder('brand')
            .innerJoin(
                'products_and_products_category',
                'pc',
                'pc.productsCategoryId = :categoryId',
                { categoryId: id },
            )
            .innerJoin('products', 'p', 'p.id = pc.productsId')
            .innerJoin('p.producers', 'producer')
            .where('pc.productsCategoryId = :categoryId', { categoryId: id })
            .distinct(true)
            .getMany();

        const [products, total] = await this.productsRepository.findAndCount({
            where: {
                productsCategory: { id },
            },
            relations: {
                producers: true,
            },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return {
            category,
            brands,
            products: {
                data: products,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async createCategory(dto: CreateCategoryDto) {
        const category = this.productsCategoryRepository.create(dto);
        return this.productsCategoryRepository.save(category);
    }

    async updateCategory(dto: UpdateCategoryDto) {
        const { id, ...updateData } = dto;
        const category = await this.productsCategoryRepository.findOne({
            where: { id },
        });

        if (!category) {
            throw new NotFoundException('Категория не найдена');
        }

        Object.assign(category, updateData);
        return this.productsCategoryRepository.save(category);
    }

    async deleteCategory(dto: DeleteCategoryDto) {
        const category = await this.productsCategoryRepository.findOne({
            where: { id: dto.id },
        });

        if (!category) {
            throw new NotFoundException('Категория не найдена');
        }

        await this.productsCategoryRepository.remove(category);
        return { success: true, message: 'Категория удалена' };
    }
}
