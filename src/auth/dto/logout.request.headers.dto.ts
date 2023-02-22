import { IsString } from 'class-validator';

export class LogoutRequestHeadersDto {
    @IsString()
    'authorization-refreshtoken': string;
    @IsString()
    'authorization-accesstoken': string;
}
