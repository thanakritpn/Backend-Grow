import { Controller, Post, Body, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @Post('register-step1')
  async registerStep1(@Body() body: { email: string; password: string; confirmPassword: string }) {
    return this.authService.registerStep1(body);
  }

  @Post('register-step2')
  async registerStep2(@Body() body: { email: string; otp: string }) {
    return this.authService.registerStep2(body);
  }

  @Post('register-step3')
  @UseInterceptors(FileInterceptor('profile_picture'))
  async registerStep3(
    @Body() body: { email: string; username: string; about_me: string; date_of_birth: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { email, username, about_me, date_of_birth } = body;
    if (!file) {
      throw new UnauthorizedException('Profile picture is required');
    }
    const profile_picture = await this.authService.uploadProfilePicture(file, email);
    return this.authService.registerStep3({ email, username, about_me, date_of_birth, profile_picture });
  }

  @Post('register-step4')
  async registerStep4(@Body() body: { email: string; interests: string[] }) {
    return this.authService.registerStep4(body);
  }

  @Post('resend-otp')
  async resendOtp(@Body() body: { email: string }) {
    return this.authService.resendOtp(body.email);
  }
}