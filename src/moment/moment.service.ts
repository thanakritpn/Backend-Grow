// moment.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MomentService {
  constructor(private prisma: PrismaService) {}

  // ⬇️ เปลี่ยนจาก getPostsByCategory -> getUsersByCategory
  async getUsersByCategory(categoryId?: number) {
    const whereClause =
      categoryId !== undefined
        ? { knowledge_interests: { has: String(categoryId) } } // filter ด้วย id ที่เป็น string
        : {};

    return this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        about_me: true,
        profile_picture: true,
        last_active: true,
        knowledge_interests: true,
        created_at: true,
        cover_photo: true,
      },
      orderBy: [
        { last_active: 'desc' },  // active ล่าสุดมาก่อน
        { created_at: 'desc' },
      ],
    });
  }

  // ยังใช้ได้เหมือนเดิม
  async getAllCategories() {
    return this.prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { created_at: 'desc' },
    });
  }
}
