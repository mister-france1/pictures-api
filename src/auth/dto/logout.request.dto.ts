import { IsString } from 'class-validator';

export class LogoutRequestDto {
    @IsString()
    RefreshToken: string;
    @IsString()
    AccessToken: string;
}
