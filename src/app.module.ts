import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
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
                port: 5433,
                username: 'postgres',
                password: 'postgres',
                database: 'diplom_technika',
                entities: [__dirname + '/**/entities/**/*.entity.{ts,js}'],
                synchronize: true,
                subscribers: [ProductSubscriber],
            }),
            inject: [ConfigService],
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/uploads', // URL путь
        }),
        AuthModule,
        ProductsModule,
        DocumentsModule,
        SeedModule,
        OrdersModule,
        UserRoleModule,
    ],
})
export class AppModule {}
