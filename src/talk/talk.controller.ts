import { Controller, Get, Post, Param, Body, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { TalkService } from './talk.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('api/talk')
export class TalkController {
  constructor(private readonly talkService: TalkService) {}

  @Get('requests')
  @UseGuards(JwtAuthGuard)
  async getRequests(@Req() req: Request) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User authentication data is missing');
    }
    return this.talkService.getRequests(req.user.id);
  }

  @Post('requests/:id/accept')
  @UseGuards(JwtAuthGuard)
  async acceptRequest(@Param('id') id: string, @Req() req: Request) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User authentication data is missing');
    }
    return this.talkService.acceptRequest(Number(id), req.user.id);
  }

  @Post('requests/:id/decline')
  @UseGuards(JwtAuthGuard)
  async declineRequest(@Param('id') id: string, @Req() req: Request) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User authentication data is missing');
    }
    return this.talkService.declineRequest(Number(id), req.user.id);
  }

  @Get('chats')
  @UseGuards(JwtAuthGuard)
  async getChats(@Req() req: Request) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User authentication data is missing');
    }
    return this.talkService.getChats(req.user.id);
  }

  @Post('messages')
  @UseGuards(JwtAuthGuard)
  async sendMessage(@Req() req: Request, @Body() body: { receiverId: number; content: string }) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User authentication data is missing');
    }
    return this.talkService.sendMessage(req.user.id, body.receiverId, body.content);
  }
}