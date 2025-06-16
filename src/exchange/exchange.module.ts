import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ExchangeController],
  providers: [ExchangeService, PrismaService],
})
export class ExchangeModule {}