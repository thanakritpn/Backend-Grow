import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExchangeService {
  constructor(private prisma: PrismaService) {}

  async getUsersByCategory(category?: string) { // เปลี่ยนเป็น optional parameter ด้วย ?
    let whereClause = {};
    if (category) {
      whereClause = {
        knowledge_interests: {
          has: category,
        },
      };
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        profile_picture: true,
        about_me: true,
        knowledge_interests: true,
        last_active: true,
      },
    });

    return { users };
  }
}