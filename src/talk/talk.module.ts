import { Module } from '@nestjs/common';
import { TalkController } from './talk.controller';
import { TalkService } from './talk.service';
import { PrismaService } from '../prisma/prisma.service';
import { TalkGateway } from './talk.gateway';

@Module({
  controllers: [TalkController],
  providers: [TalkService, PrismaService, TalkGateway],
})
export class TalkModule {}