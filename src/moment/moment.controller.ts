import { Controller, Get, Query } from '@nestjs/common';
import { MomentService } from './moment.service';

@Controller('moment')
export class MomentController {
  constructor(private momentService: MomentService) {}

  @Get()
  async getPostsByCategory(@Query('categoryId') categoryId: string) {
    const catId = categoryId ? parseInt(categoryId) : undefined;
    return this.momentService.getPostsByCategory(catId);
  }

  @Get('all')
  async getAllPosts() {
    return this.momentService.getPostsByCategory();
  }

  @Get('categories')
  async getAllCategories() {
    return this.momentService.getAllCategories();
  }
}