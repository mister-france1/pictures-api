import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { DbModule } from '../db/db.module';

@Module({
    imports: [ConfigModule, DbModule],
    providers: [FilesService],
    controllers: [FilesController]
})
export class FilesModule {}
