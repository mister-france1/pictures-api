import { Controller, Get, Post, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Express } from 'express';
import JwtAuthenticationGuard from '../auth/jwt.guard';

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
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(FileInterceptor('file'))
    async sendFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
        //tmp
        console.log('user ', req.user);
        console.log('id ', req.user.sub);
        return this.filesService.uploadPublicFile(file.buffer, file.originalname);
    }
}
