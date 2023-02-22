import { BadRequestException, Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticateRequestDto } from './dto/authenticate.request.dto';
import { RegisterRequestDto } from './dto/register.request.dto';
import JwtAuthenticationGuard from './jwt.guard';
import { LogoutRequestDto } from './dto/logout.request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerRequest: RegisterRequestDto) {
    try {
      return await this.authService.register(registerRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Post('authenticate')
  async authenticate(@Body() authenticateRequest: AuthenticateRequestDto) {
    try {
      return await this.authService.authenticate(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Get('authorized')
  @UseGuards(JwtAuthenticationGuard)
  authorized(): string {
    return 'success';
  }

  @Post('logout')
  @UseGuards(JwtAuthenticationGuard)
  async logout(@Request() req, @Body() body: LogoutRequestDto): Promise<string> {
    try {
      const { RefreshToken, AccessToken } = body;
      const IdToken = req.headers.authorization.split(' ')[1];
      return await this.authService.logout(req.user['cognito:username'], {IdToken, RefreshToken, AccessToken});
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
