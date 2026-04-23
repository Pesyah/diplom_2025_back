import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AlertsModule } from './alerts/alerts.module';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { GroupsModule } from './groups/groups.module';
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
                database: 'diplom_studenti',
                entities: [__dirname + '/**/entities/**/*.entity.{ts,js}'],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/uploads', // URL путь
        }),
        SeedModule,
        AuthModule,
        UserRoleModule,
        GroupsModule,
        AlertsModule,
        DocumentsModule,
    ],
})
export class AppModule {}
