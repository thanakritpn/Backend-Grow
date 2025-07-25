import { Injectable,NotFoundException } from '@nestjs/common';
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





async getAllUsers() {
  const users = await this.prisma.user.findMany({
    orderBy: { created_at: 'desc' },
  });

  return {
    success: true,
    message: 'Fetched all users successfully',
    timestamp: new Date().toISOString(),
    data: users,
  };
}










async deleteUser(id: number) {
  // ตรวจสอบก่อนว่าผู้ใช้นั้นมีจริงไหม
  const existingUser = await this.prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }

  // ลบผู้ใช้
  await this.prisma.user.delete({
    where: { id },
  });

  return {
    success: true,
    message: `User with ID ${id} deleted successfully`,
    timestamp: new Date().toISOString(),
  };

}





}