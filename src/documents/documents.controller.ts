import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiSecurity } from '@nestjs/swagger';
import type { Response } from 'express';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Users } from '../auth/entities/users.entity';
import { DocumentsService } from './documents.service';
import { FileRequeryDto } from './dto/create-document.dto';

@ApiSecurity('X-AUTH-TOKEN')
@Controller('documents')
@UseGuards(AuthGuard)
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}

    @Post('upload')
    @ApiBody({ type: FileRequeryDto })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: { fileSize: 10 * 1024 * 1024 },
        }),
    )
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @GetUser() user: Users,
    ) {
        if (!file) {
            throw new BadRequestException('Файл не загружен');
        }
        return this.documentsService.create(file, user.id);
    }

    @Get('my')
    async getUserDocuments(
        @GetUser() user: Users,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.documentsService.getUserDocuments(
            user.id,
            page ? +page : 1,
            limit ? +limit : 20,
        );
    }

    @Get(':id')
    async getDocumentById(@Param('id') id: string, @GetUser() user: Users) {
        return this.documentsService.findOne(id, user.id);
    }

    @Get('download/:id')
    async downloadFile(
        @Param('id') id: string,
        @GetUser() user: Users,
        @Res({ passthrough: true }) res: Response,
    ) {
        const document = await this.documentsService.findOne(id, user.id);

        // Проверяем существует ли файл
        try {
            await stat(document.path);
        } catch {
            throw new NotFoundException('Файл не найден на диске');
        }

        const fileStream = createReadStream(document.path);

        res.set({
            'Content-Type': document.mimeType,
            'Content-Disposition': `inline; filename="${encodeURIComponent(document.originalName)}"`,
            'Content-Length': document.size,
        });

        fileStream.pipe(res);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @GetUser() user: Users) {
        return this.documentsService.remove(id, user.id);
    }
}
