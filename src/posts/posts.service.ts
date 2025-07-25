import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: number, title: string, content: string, categoryId: number, imageUrls: string[]) {
    if (imageUrls.length < 1 || imageUrls.length > 3) {
      throw new BadRequestException('A post must contain 1-3 images');
    }

    const post = await this.prisma.post.create({
      data: {
        authorId: userId,
        category_id: Number(categoryId), // แปลงเป็น Number อย่างชัดเจน
        title,
        content,
      },
    });

    await this.prisma.postImage.createMany({
      data: imageUrls.map((image_url) => ({
        post_id: post.id,
        image_url,
      })),
    });

    return this.prisma.post.findUnique({
      where: { id: post.id },
      include: { images: true },
    });
  }



  async getPosts(categoryId?: number, limit: number = 10) {
    return this.prisma.post.findMany({
      where: categoryId ? { category_id: Number(categoryId) } : {},
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        user: { select: { id: true, username: true } },
        images: true,
        likes: true,
        comments: true,
      },
    });
  }


  async getPostById(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: Number(postId) },
      include: {
        user: { select: { id: true, username: true } },
        images: true,
        likes: { select: { user_id: true } },
        comments: { 
          select: { 
            id: true, 
            content: true, 
            user: { select: { username: true } }, 
            created_at: true 
          } 
        },
      },
    });



    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }




    const userAge = 23;
    const category = await this.prisma.category.findUnique({ where: { id: post.category_id } });
    const categoryName = category ? category.name : 'Unknown';

    return {
      user: { username: post.user.username, age: userAge },
      category: categoryName,
      title: post.title,
      content: post.content,
      images: post.images.map(img => img.image_url),
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      comments: post.comments,
    };
  }

  async likePost(postId: number, userId: number) {
    const post = await this.prisma.post.findUnique({ where: { id: Number(postId) } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const existingLike = await this.prisma.like.findFirst({
      where: { post_id: Number(postId), user_id: userId },
    });
    if (existingLike) {
      throw new BadRequestException('Already liked');
    }

    await this.prisma.like.create({
      data: { post_id: Number(postId), user_id: userId },
    });

    const likesCount = await this.prisma.like.count({ where: { post_id: Number(postId) } });
    return { message: 'Post liked successfully', likesCount };
  }

  async unlikePost(postId: number, userId: number) {
    const post = await this.prisma.post.findUnique({ where: { id: Number(postId) } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const existingLike = await this.prisma.like.findFirst({
      where: { post_id: Number(postId), user_id: userId },
    });
    if (!existingLike) {
      throw new NotFoundException('Like not found');
    }

    await this.prisma.like.delete({
      where: { id: existingLike.id },
    });

    const likesCount = await this.prisma.like.count({ where: { post_id: Number(postId) } });
    return { message: 'Post unliked successfully', likesCount };
  }

  async getComments(postId: number, limit: number = 10) {
    const post = await this.prisma.post.findUnique({ where: { id: Number(postId) } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return this.prisma.comment.findMany({
      where: { post_id: Number(postId) },
      take: limit,
      orderBy: { created_at: 'desc' },
      select: { id: true, content: true, user: { select: { username: true } }, created_at: true },
    });
  }

  async createComment(postId: number, userId: number, content: string) {
    if (!content || content.trim().length === 0) {
      throw new BadRequestException('Invalid content');
    }

    const post = await this.prisma.post.findUnique({ where: { id: Number(postId) } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const comment = await this.prisma.comment.create({
      data: { content, user_id: userId, post_id: Number(postId) },
      select: { id: true, content: true, user: { select: { username: true } }, created_at: true },
    });

    return comment;
  }

  async uploadPostImages(files: Express.Multer.File[], userId: number): Promise<string[]> {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'posts'); // ใช้ process.cwd() เพื่ออ้างถึง root path
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const imageUrls: string[] = [];
    for (const file of files) {
      const filename = `${Date.now()}-${userId}-${file.originalname}`;
      const uploadPath = path.join(uploadsDir, filename);
      try {
        await fs.promises.writeFile(uploadPath, file.buffer);
        console.log(`File saved successfully at: ${uploadPath}`);
        imageUrls.push(`/uploads/posts/${filename}`);
      } catch (error) {
        console.error('Error saving file:', error);
        throw new BadRequestException('Failed to upload one or more images');
      }
    }
    return imageUrls;
  }
}