import { Module } from '@nestjs/common';
import { MomentController } from './moment.controller';
import { MomentService } from './moment.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MomentController],
  providers: [MomentService],
})
export class MomentModule {}