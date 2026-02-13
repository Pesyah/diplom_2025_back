import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeModule } from './coffee/coffee.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

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
                database: 'diplom_coffee',
                entities: [__dirname + '/**/entities/**/*.entity.{ts,js}'],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        CoffeeModule,
        ProductsModule,
        OrdersModule,
    ],
})
export class AppModule {}
