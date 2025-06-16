import { Module } from '@nestjs/common';
import { TalkController } from './talk.controller';
import { TalkService } from './talk.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TalkController],
  providers: [TalkService, PrismaService],
})
export class TalkModule {}