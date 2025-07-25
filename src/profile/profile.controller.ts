import { Controller, Get, Put, Body, UseGuards, Req, Param, Post, Delete, BadRequestException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Req() req: Request) {
    return this.profileService.getMyProfile(req);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateMyProfile(@Req() req: Request, @Body() body: { profilePicture?: string; coverPhoto?: string; aboutMe?: string; knowledgeInterests?: string[] }) {
    return this.profileService.updateMyProfile(req, body);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Param('id') id: string, @Req() req: Request) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User authentication data is missing');
    }
    return this.profileService.getUserProfile(Number(id), req.user.id);
  }

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  async followUser(@Param('id') id: string, @Req() req: Request) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User authentication data is missing');
    }
    return this.profileService.followUser(Number(id), req.user.id);
  }

  @Delete(':id/follow')
  @UseGuards(JwtAuthGuard)
  async unfollowUser(@Param('id') id: string, @Req() req: Request) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User authentication data is missing');
    }
    return this.profileService.unfollowUser(Number(id), req.user.id);
  }

  @Post(':id/request-connect')
  @UseGuards(JwtAuthGuard)
  async requestConnect(@Param('id') id: string, @Req() req: Request, @Body() body: { message: string }) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User authentication data is missing');
    }
    return this.profileService.requestConnect(Number(id), req.user.id, body.message);
  }





// kate create
  // @Post('cancel-register')
  // async cancelRegister(@Body() body: { email: string }) {
  //   return this.profileService.cancelRegistration(body.email);
  // }
  @Get('all')
  async getAllUsers() {
  return this.profileService.getAllUsers();
}











}