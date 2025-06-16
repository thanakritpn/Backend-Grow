import { Module } from '@nestjs/common';
import { FindController } from './find.controller';
import { FindService } from './find.service';
import { PrismaModule } from '../prisma/prisma.module'; // ต้องมีโมดูล Prisma

@Module({
  imports: [PrismaModule],
  controllers: [FindController],
  providers: [FindService],
})
export class FindModule {}