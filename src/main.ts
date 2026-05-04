import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({ origin: true });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Удаляет все неописанные поля
            forbidNonWhitelisted: false, // Выбрасывает ошибку для неизвестных полей
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
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
