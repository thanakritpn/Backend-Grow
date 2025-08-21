import { Controller, Post, Body, Get, Query, Param, UseGuards, Req, Delete, UnauthorizedException, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 3 }, 
  ]))
  async createPost(
    @Body() body: { title: string; content: string; categoryId: number },
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Req() req: Request
  ) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.id;
    if (!files.images || files.images.length < 1 || files.images.length > 3) {
      throw new UnauthorizedException('A post must contain 1-3 images');
    }
    const imageUrls = await this.postsService.uploadPostImages(files.images, userId);
    return this.postsService.createPost(userId, body.title, body.content, body.categoryId, imageUrls);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getPosts(@Query('categoryId') categoryId?: number, @Query('limit') limit: number = 10) {
    return this.postsService.getPosts(categoryId, limit);
  }

 @Get(':postId')
@UseGuards(JwtAuthGuard)
async getPostById(@Param('postId') postId: number, @Req() req: Request) {
  const userId = req.user?.id;
  return this.postsService.getPostById(postId, userId);
}

  

  @Post(':postId/like')
  @UseGuards(JwtAuthGuard)
  async likePost(@Param('postId') postId: number, @Req() req: Request) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.id;
    return this.postsService.likePost(postId, userId);
  }

  @Delete(':postId/like')
  @UseGuards(JwtAuthGuard)
  async unlikePost(@Param('postId') postId: number, @Req() req: Request) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.id;
    return this.postsService.unlikePost(postId, userId);
  }

  @Get(':postId/comments')
  @UseGuards(JwtAuthGuard)
  async getComments(@Param('postId') postId: number, @Query('limit') limit: number = 10) {
    return this.postsService.getComments(postId, limit);
  }

  @Post(':postId/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('postId') postId: number,
    @Req() req: Request,
    @Body('content') content: string
  ) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.id;
    return this.postsService.createComment(postId, userId, content);
  }
}