import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // ทำให้ PrismaService ใช้ได้ทั่วแอป
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
