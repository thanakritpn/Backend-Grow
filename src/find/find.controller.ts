import { Controller, Get, Query, Delete, Param } from '@nestjs/common';
import { FindService } from './find.service';

@Controller('find')
export class FindController {
  constructor(private findService: FindService) {}


  @Get()
  async getUsersByCategory(@Query('categoryId') categoryId: string) {
    const catId = categoryId ? parseInt(categoryId) : undefined;
    return this.findService.getUsersByCategory(catId);
  }



  @Get('all')
  async getAllUsers() {
  return this.findService.getAllUsers();

}


 @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.findService.deleteUser(Number(id));
  }




}