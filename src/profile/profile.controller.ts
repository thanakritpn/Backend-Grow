import { Controller, Get, Put, Body, UseGuards, Req, Param, Post, Delete, BadRequestException, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'profilePicture',
          maxCount: 1,
        },
        {
          name: 'coverPhoto',
          maxCount: 1,
        },
      ],
      {
        storage: diskStorage({
          destination: './uploads/profiles', // ใช้โฟลเดอร์เดียวกัน
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const field = file.fieldname === 'coverPhoto' ? 'cover' : 'profile';
            cb(null, `${field}-${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  async updateMyProfile(
    @Req() req: Request,
    @Body() body: any,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      coverPhoto?: Express.Multer.File[];
    },
  ) {
    const profilePicturePath = files.profilePicture?.[0]
      ? `/uploads/profiles/${files.profilePicture[0].filename}`
      : undefined;

    const coverPhotoPath = files.coverPhoto?.[0]
      ? `/uploads/profiles/${files.coverPhoto[0].filename}`
      : undefined;

    const data = {
      profilePicture: profilePicturePath,
      coverPhoto: coverPhotoPath,
      aboutMe: body?.aboutMe,
      knowledgeInterests: body?.knowledgeInterests
        ? JSON.parse(body.knowledgeInterests)
        : undefined,
    };

    return this.profileService.updateMyProfile(req, data);
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