import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FindService {
  constructor(private prisma: PrismaService) {}

  async getUsersByCategory(categoryId?: number) {
    const whereClause = categoryId
      ? { knowledge_interests: { has: categoryId.toString() } } // ใช้ knowledge_interests แทน user_categories
      : {};
    const users = await this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        about_me: true,
        profile_picture: true,
        last_active: true,
        knowledge_interests: true, // ใช้ knowledge_interests แทน user_categories
      },
    });
    return { users };
  }
}