import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { DbService } from '../db/db.service';

@Injectable()
export class FilesService {
    constructor(
        private readonly configService: ConfigService,
        private readonly dbService: DbService
    ) {}

    async getFiles(userId: string) {
        const params = {
            TableName: this.configService.get('AWS_DYNAMO_DB_TABLE_NAME'),
            KeyConditionExpression: 'user_id = :user_id',
            ExpressionAttributeValues: {
                ':user_id': userId
            }
        };

        const result = await this.dbService.getItems(params);
        const items = result.Items.map((item) => item);

        return items;
    }

    async uploadFile(userId: string, dataBuffer: Buffer, filename: string): Promise<string> {
        const s3 = new S3();
        const uploadResult = await s3.upload({
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
            Body: dataBuffer,
            Key: `${uuid()}-${filename}`
        })
            .promise();

        const params = {
            TableName: this.configService.get('AWS_DYNAMO_DB_TABLE_NAME'),
            Item: {
                user_id: userId,
                picture_id: uuid(),
                resized_url: `${this.configService.get('AWS_S3_RESIZED_BUCKET_URL')}${uploadResult.Key}`,
                url: `${this.configService.get('AWS_S3_ORIGIN_BUCKET_URL')}${uploadResult.Key}`
            }
        };

        await this.dbService.putItem(params);

        return 'success';
    }
};
