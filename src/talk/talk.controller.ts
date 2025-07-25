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

  // Kate edit
  @Post('requests/from/:senderId/accept')
  @UseGuards(JwtAuthGuard)
  async acceptRequest(@Param('senderId') senderId: string, @Req() req: Request) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User authentication data is missing');
    }
    return this.talkService.acceptRequest(Number(senderId), req.user.id);
  }

  // Kate edit
  @Post('requests/from/:senderId/decline')
  @UseGuards(JwtAuthGuard)
  async declineRequest(@Param('senderId') senderId: string, @Req() req: Request) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User authentication data is missing');
    }
    return this.talkService.declineRequest(Number(senderId), req.user.id);
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


@Post('requests')
@UseGuards(JwtAuthGuard)
async createRequest(
  @Req() req: Request,
  @Body() body: { receiverId: number; message: string }
) {
  if (!req.user || !req.user.id) {
    throw new BadRequestException('User authentication data is missing');
  }
  if (!body.receiverId || !body.message) {
    throw new BadRequestException('receiverId and message are required');
  }
  return this.talkService.createRequest(req.user.id, body.receiverId, body.message);
}




@Get('messages/:withUserId')
@UseGuards(JwtAuthGuard)
async getMessagesWithUser(@Req() req: Request, @Param('withUserId') withUserId: string) {
  const userId = req.user?.id;
  if (!userId) throw new BadRequestException('Missing user info');

  return this.talkService.getMessagesBetween(userId, Number(withUserId));
}


// kate create
@Get('spamlist')
  @UseGuards(JwtAuthGuard)
  async getSpamList(@Req() req: Request) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User authentication data is missing');
    }
    return this.talkService.getSpamList(req.user.id);
  } 

@Post('call/start')
  @UseGuards(JwtAuthGuard)
  async startCall(@Req() req: Request, @Body() body: { receiverId: number; type: 'VOICE' | 'VIDEO' }) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User not authenticated');
    }
    if (!body.receiverId || !body.type) {
      throw new BadRequestException('receiverId and type are required');
    }

    return this.talkService.startCall(req.user.id, body.receiverId, body.type);
  }

  @Post('call/end/:callId')
    @UseGuards(JwtAuthGuard)
    async endCall(@Param('callId') callId: string) {
      return this.talkService.endCall(Number(callId));
    }

  @Post('call/:callId/accept')
    @UseGuards(JwtAuthGuard)
    async acceptCall(@Req() req: Request, @Param('callId') callId: string) {
      if (!req.user || !req.user.id) {
        throw new BadRequestException('User not authenticated');
      }
      return this.talkService.acceptCall(Number(callId), req.user.id);
    }


  @Post('call/:callId/decline')
    @UseGuards(JwtAuthGuard)
    async declineCall(@Req() req: Request, @Param('callId') callId: string) {
      if (!req.user || !req.user.id) {
        throw new BadRequestException('User not authenticated');
      }
      return this.talkService.declineCall(Number(callId), req.user.id);
    }

  @Post('call/:callId/cancel')
    @UseGuards(JwtAuthGuard)
    async cancelCall(@Req() req: Request, @Param('callId') callId: string) {
      if (!req.user || !req.user.id) {
        throw new BadRequestException('User not authenticated');
      }
      return this.talkService.cancelCall(Number(callId), req.user.id);
    }

  @Get('call/incoming-call')
    @UseGuards(JwtAuthGuard)
    async getIncomingCall(@Req() req: Request) {
      if (!req.user || !req.user.id) {
        throw new BadRequestException('User authentication data is missing');
      }

      return this.talkService.getIncomingCall(req.user.id);
    }

    // TalkController.ts
  @Get('call/:callId')
    @UseGuards(JwtAuthGuard)
    async getCallStatus(@Param('callId') callId: string, @Req() req: Request) {
      if (!req.user || !req.user.id) {
        throw new BadRequestException('User authentication data is missing');
      }

      return this.talkService.getCallStatus(Number(callId), req.user.id);
    }




}


