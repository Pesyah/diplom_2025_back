import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { ProductSubscriber } from './products/entities/products.subscriber';
import { ProductsModule } from './products/products.module';
import { SeedModule } from './seed/seed.module';
import { UserRoleModule } from './userRole/userRole.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env', // указывает на файл .env в корне проекта
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: 'postgres',
                database: 'diplom_technika',
                entities: [__dirname + '/**/entities/**/*.entity.{ts,js}'],
                synchronize: true,
                subscribers: [ProductSubscriber],
            }),
            inject: [ConfigService],
        }),
        ProductsModule,
        SeedModule,
        OrdersModule,
        UserRoleModule,
    ],
})
export class AppModule {}
