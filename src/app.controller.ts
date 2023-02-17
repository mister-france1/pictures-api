import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import JwtAuthenticationGuard from './modules/auth/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  getHelloPost(): string {
    return 'Test';
  }
}
