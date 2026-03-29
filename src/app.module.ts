import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { OrdersModule } from './orders/orders.module';
import { PizzaModule } from './pizza/pizza.module';
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
                database: 'diplom_pizza',
                entities: [__dirname + '/**/entities/**/*.entity.{ts,js}'],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        SeedModule,
        UserRoleModule,
        PizzaModule,
        OrdersModule,
        DocumentsModule,
    ],
})
export class AppModule {}
