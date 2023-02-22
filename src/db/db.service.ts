import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class DbService {
    private dynamoDb: AWS.DynamoDB.DocumentClient;

    constructor() {
        this.dynamoDb = new AWS.DynamoDB.DocumentClient();
    }

    async getItems(params: AWS.DynamoDB.DocumentClient.QueryInput): Promise<AWS.DynamoDB.DocumentClient.QueryOutput> {
        return this.dynamoDb.query(params).promise();
    }

    async putItem(params: AWS.DynamoDB.DocumentClient.PutItemInput): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
        return this.dynamoDb.put(params).promise();
    }

    async deleteItem(params: AWS.DynamoDB.DocumentClient.DeleteItemInput): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput> {
        return this.dynamoDb.delete(params).promise();
    }
}
