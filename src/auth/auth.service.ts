import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { Express } from 'express';


@Injectable()
export class AuthService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aofza1508@gmail.com',
      pass: 'bksl opte amkf tiee',
    },
  });

  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(data: { email: string; password: string }) {
    const { email, password } = data;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ email: user.email, username: user.username });
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile_picture: user.profile_picture,
      }
    };

  }

  async registerStep1(data: { email: string; password: string; confirmPassword: string }) {
    const { email, password, confirmPassword } = data;
    if (password !== confirmPassword) throw new UnauthorizedException('Passwords do not match');
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new UnauthorizedException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const username = `user_${Date.now()}`;
    await this.prisma.user.create({
      data: { email, password: hashedPassword, role: 'GUEST', username },
    });
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('User creation failed');
    await this.prisma.otp.create({
      data: { user_id: user.id, code: otpCode, expires_at: otpExpiresAt },
    });
    await this.sendOtpEmail(email, otpCode);
    return { email };
  }

  async registerStep2(data: { email: string; otp: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new UnauthorizedException('User not found');
    console.log('User ID:', user.id, 'OTP Input:', data.otp);
    const otpRecord = await this.prisma.otp.findFirst({
      where: { user_id: user.id, code: data.otp, expires_at: { gte: new Date() } },
    });
    console.log('OTP Record:', otpRecord);
    if (!otpRecord) throw new UnauthorizedException('Invalid or expired OTP');
    await this.prisma.otp.delete({ where: { id: otpRecord.id } });
    return { email: data.email };
  }

  async registerStep3(data: { email: string; username: string; about_me: string; date_of_birth: string; profile_picture: string }) {
    const { email, username, about_me, date_of_birth, profile_picture } = data;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('User not found');
    const existingUsername = await this.prisma.user.findUnique({ where: { username } });
    if (existingUsername && existingUsername.email !== email) throw new UnauthorizedException('Username already exists');
    await this.prisma.user.update({
      where: { email },
      data: { username, about_me, date_of_birth: new Date(date_of_birth), profile_picture },
    });
    return { email };
  }

  async registerStep4(data: { email: string; interests: string[] }) {
    const { email, interests } = data;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('User not found');
    await this.prisma.user.update({
      where: { email },
      data: { role: 'USER', knowledge_interests: interests },
    });
    const token = this.jwtService.sign({ email: user.email, username: user.username });
    return { token };
  }

  async resendOtp(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('User not found');
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.prisma.otp.create({ data: { user_id: user.id, code: otpCode, expires_at: otpExpiresAt } });
    await this.sendOtpEmail(email, otpCode);
    return { message: 'OTP resent' };
  }

  private async sendOtpEmail(email: string, otp: string) {
    const mailOptions = { from: 'aofza1508@gmail.com', to: email, subject: 'Your OTP Code', text: `Your OTP code is ${otp}. It expires in 10 minutes.` };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new UnauthorizedException('Failed to send OTP email');
    }
  }

  public async uploadProfilePicture(file: Express.Multer.File, email: string): Promise<string> {
    const filename = `${Date.now()}-${file.originalname}`;
    // กำหนด path ไปที่ uploads/profiles ใน root ของโปรเจกต์
    const uploadDir = path.join(process.cwd(), 'uploads', 'profiles');
    const uploadPath = path.join(uploadDir, filename);

    // ตรวจสอบและสร้างโฟลเดอร์ถ้ายังไม่มี
    console.log('Current working directory:', process.cwd());
    console.log('Saving file to:', uploadPath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    try {
      await fs.promises.writeFile(uploadPath, file.buffer);
      console.log(`File saved successfully at: ${uploadPath}`);
      return `/uploads/profiles/${filename}`;
    } catch (error) {
      console.error('Error saving file:', error);
      throw new UnauthorizedException('Failed to upload profile picture');
    }
  }
}