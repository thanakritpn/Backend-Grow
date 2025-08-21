import { Controller, Get, Query } from '@nestjs/common';
import { MomentService } from './moment.service';

@Controller('moment')
export class MomentController {
  constructor(private momentService: MomentService) {}

  // ⬇️ เปลี่ยนให้ดึง "users" ตาม category
  @Get()
  async getUsersByCategory(@Query('categoryId') categoryId?: string) {
    const catId = categoryId !== undefined ? Number(categoryId) : undefined;
    return this.momentService.getUsersByCategory(Number.isNaN(catId) ? undefined : catId);
  }

  // ⬇️ เดิม /moment/all ตอนนี้จะคืน users ทั้งหมด
  @Get('all')
  async getAllUsers() {
    return this.momentService.getUsersByCategory();
  }

  // คงเดิม
  @Get('categories')
  async getAllCategories() {
    return this.momentService.getAllCategories();
  }
}