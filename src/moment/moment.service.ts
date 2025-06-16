import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MomentService {
  constructor(private prisma: PrismaService) {}

  async getPostsByCategory(categoryId?: number) {
    return this.prisma.post.findMany({
      where: {
        category_id: categoryId,
      },
      include: {
        user: { select: { username: true, profile_picture: true } },
        category: { select: { name: true } },
        images: { select: { image_url: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getAllCategories() {
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        created_at: 'desc', // หรือ 'name' ตามต้องการ
      },
    });
  }
}