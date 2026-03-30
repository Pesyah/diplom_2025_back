import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: [
            'http://localhost:8080', // Vue CLI стандартный порт
            'http://localhost:8081', // Альтернативный порт
            'http://127.0.0.1:8080',
            'http://127.0.0.1:8081',
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true, // Если используете cookies/авторизацию
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Удаляет все неописанные поля
            forbidNonWhitelisted: true, // Выбрасывает ошибку для неизвестных полей
            transform: true,
            transformOptions: {
                exposeUnsetFields: false,
                enableImplicitConversion: true,
            },
        }),
    );

    // Swagger виден только если это не прод
    const config = new DocumentBuilder()
        .setTitle('Diplom')
        .setDescription('')
        .setVersion('1.0')
        .addApiKey(
            {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
                description: 'Enter your token',
            },
            'X-AUTH-TOKEN',
        )
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
