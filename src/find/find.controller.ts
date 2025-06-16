import { Controller, Get, Query } from '@nestjs/common';
import { FindService } from './find.service';

@Controller('find')
export class FindController {
  constructor(private findService: FindService) {}

  @Get()
  async getUsersByCategory(@Query('categoryId') categoryId: string) {
    const catId = categoryId ? parseInt(categoryId) : undefined;
    return this.findService.getUsersByCategory(catId);
  }
}