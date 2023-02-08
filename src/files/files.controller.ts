import { Controller, Get, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Express } from 'express';

@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
    ) {}

    @Get()
    getFiles(): string {
        return 'Files';
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async sendFile(@UploadedFile() file: Express.Multer.File) {
        return this.filesService.uploadPublicFile(file.buffer, file.originalname);
    }
}
