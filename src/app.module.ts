import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsModule } from './alerts/alerts.module';
import { GroupsModule } from './groups/groups.module';

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
                database: 'diplom_studenti',
                entities: [__dirname + '/**/entities/**/*.entity.{ts,js}'],
                synchronize: true,
                logging: true,
            }),
            inject: [ConfigService],
        }),
        GroupsModule,
        AlertsModule,
    ],
})
export class AppModule {}
