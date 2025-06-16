import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getUsersByCategory(@Query('category') category: string) {
    return this.exchangeService.getUsersByCategory(category);
  }
}