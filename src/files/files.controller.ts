import { Controller, Get, Post, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Express } from 'express';
import JwtAuthenticationGuard from '../auth/jwt.guard';

@Controller('api/files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
    ) {}

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    getFiles(@Request() req) {
        return this.filesService.getFiles(req.user.sub);
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(FileInterceptor('file'))
    async sendFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
        return this.filesService.uploadFile(req.user.sub, file.buffer, file.originalname);
    }
}
