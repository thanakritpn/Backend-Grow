import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CallStatus } from '@prisma/client';

@Injectable()
export class TalkService {
  constructor(private prisma: PrismaService) {}

  async getRequests(userId: number) {
    const requests = await this.prisma.chatRequest.findMany({
      where: { receiver_id: userId, status: 'PENDING', hidden_from_receiver: false }, // kate edit hidden_from_receiver
      include: { sender: { select: { id: true, username: true } } },

    });
    return {
      requests: requests.map(r => ({
        id: r.id,
        senderId: r.sender_id,
        senderUsername: r.sender.username,
        message: r.message,
        created_at: r.created_at,
        status: r.status,
      })),
    };
  }
  // Kate Edit
    async acceptRequest(senderId: number, receiverId: number) {
    const requests = await this.prisma.chatRequest.findMany({
      where: {
        sender_id: senderId,
        receiver_id: receiverId,
        status: 'PENDING',
      },
    });

    if (requests.length === 0) {
      throw new NotFoundException('No pending request from this user');
    }

    // ✅ อัปเดตสถานะของ request เป็น ACCEPTED
    await this.prisma.chatRequest.updateMany({
      where: {
        sender_id: senderId,
        receiver_id: receiverId,
        status: 'PENDING',
      },
      data: {
        status: 'ACCEPTED',
      },
    });

    // ✅ อัปเดต connection เป็น ACCEPTED (หรือสร้างใหม่ถ้ายังไม่มี)
    const [user1, user2] = senderId < receiverId ? [senderId, receiverId] : [receiverId, senderId];

    await this.prisma.connection.upsert({
      where: {
        user1_id_user2_id: {
          user1_id: user1,
          user2_id: user2,
        },
      },
      update: { status: 'ACCEPTED' },
      create: {
        user1_id: user1,
        user2_id: user2,
        status: 'ACCEPTED',
      },
    });

    // ✅ ทำเครื่องหมายข้อความที่ sender ส่งมาว่า "อ่านแล้ว"
    await this.prisma.message.updateMany({
      where: {
        sender_id: senderId,
        receiver_id: receiverId,
        is_read: false,
      },
      data: {
        is_read: true,
      },
    });

    return { message: 'Accepted all requests from this user' };
  }




  async declineRequest(senderId: number, receiverId: number) {
    const requests = await this.prisma.chatRequest.findMany({
      where: {
        sender_id: senderId,
        receiver_id: receiverId,
        status: 'PENDING',
      },
    });

    if (requests.length === 0) {
      throw new NotFoundException('No pending request from this user');
    }

    await this.prisma.chatRequest.updateMany({
      where: {
        sender_id: senderId,
        receiver_id: receiverId,
        status: 'PENDING',
      },
      data: {
        status: 'DECLINED',
        hidden_from_receiver: true,
      },
    });

    const [user1, user2] = senderId < receiverId ? [senderId, receiverId] : [receiverId, senderId];

    await this.prisma.connection.updateMany({
      where: { user1_id: user1, user2_id: user2 },
      data: { status: 'REJECTED' },
    });

    return { message: 'Declined all requests from this user' };
  }



  async getChats(userId: number) {
    const connections = await this.prisma.connection.findMany({
      where: {
        OR: [
          {
            AND: [{ status: 'ACCEPTED' }, { OR: [{ user1_id: userId }, { user2_id: userId }] }],
          },
          {
            AND: [{ user1_id: userId }, { status: { in: ['PENDING', 'REJECTED'] } }],
          },
        ],
      },
      include: {
        user1: { select: { id: true, username: true, profile_picture: true } },
        user2: { select: { id: true, username: true, profile_picture: true } },
      },
    });

    const chats: {
      userId: number;
      username: string;
      avatar: string | null;
      lastMessage: string;
      lastMessageTime: Date | null;
      status: string;
    }[] = [];

    for (const conn of connections) {
      const isSender = conn.user1_id === userId;
      const otherUser = isSender ? conn.user2 : conn.user1;

      const lastMessage = await this.prisma.message.findFirst({
        where: {
          OR: [
            { sender_id: userId, receiver_id: otherUser.id },
            { sender_id: otherUser.id, receiver_id: userId },
          ],
        },
        orderBy: { sent_at: 'desc' },
      });

      chats.push({
        userId: otherUser.id,
        username: otherUser.username,
        avatar: otherUser.profile_picture || null, 
        lastMessage: lastMessage?.content || '',
        lastMessageTime: lastMessage?.sent_at || null,
        status: conn.status,
      });
    }

    return { chats };
  }






// Kate Edit
  async sendMessage(senderId: number, receiverId: number, content: string) {
    // 🔄 จัดเรียงให้แน่ใจว่า user1 < user2 (ให้ตรงกับตอน create)
    const [user1, user2] = senderId < receiverId
      ? [senderId, receiverId]
      : [receiverId, senderId];

    // ✅ ตรวจสอบว่ามี connection และสถานะเป็น ACCEPTED
    const connection = await this.prisma.connection.findUnique({
      where: {
        user1_id_user2_id: { user1_id: user1, user2_id: user2 },
      },
    });

    if (!connection || connection.status !== 'ACCEPTED') {
      throw new BadRequestException('Cannot send message to this user');
    }

    // ✅ สร้างข้อความ
    const message = await this.prisma.message.create({
      data: {
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        is_delivered: true, // ✅ สมมุติว่า delivered ทันที (หรือจะรอ socket ก็ได้)
        is_read: false,
        is_failed: false,
      },
    });

      return { message: {
        id: message.id,
        content: message.content,
        sent_at: message.sent_at,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
      }
 };
  }


// Kate Edit
  async createRequest(senderId: number, receiverId: number, message: string) {
    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send request to yourself');
    }

    // 🔍 เช็กว่าเคยมี request ที่ถูกปฏิเสธภายใน 24 ชม. หรือไม่
    const declined = await this.prisma.chatRequest.findFirst({
      where: {
        sender_id: senderId,
        receiver_id: receiverId,
        status: 'DECLINED',
        created_at: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // ภายใน 24 ชั่วโมง
        },
      },
    });

    if (declined) {
      throw new BadRequestException('You must wait 24 hours after a declined request before sending again');
    }

    // ✅ ไม่ต้องเช็ก PENDING — เพราะอนุญาตให้ส่งซ้ำได้

    // ✅ สร้าง ChatRequest ใหม่
    const chatRequest = await this.prisma.chatRequest.create({
      data: {
        sender_id: senderId,
        receiver_id: receiverId,
        message,
        status: 'PENDING',
      },
    });

    // ✅ บันทึก message ที่ใช้เปิดแชท
    await this.prisma.message.create({
      data: {
        sender_id: senderId,
        receiver_id: receiverId,
        content: message,
        is_request: true,
      },
    });

    // ✅ สร้าง connection แบบ pending (ถ้ายังไม่มี)
    const [user1, user2] = senderId < receiverId
      ? [senderId, receiverId]
      : [receiverId, senderId];

    await this.prisma.connection.upsert({
      where: {
        user1_id_user2_id: { user1_id: user1, user2_id: user2 },
      },
      update: {}, // ไม่เปลี่ยนสถานะ
      create: {
        user1_id: user1,
        user2_id: user2,
        status: 'PENDING',
      },
    });

    return { success: true, chatRequest };
  }


  // kate edit
  async getSpamList(userId: number) {
    const spamRequests = await this.prisma.chatRequest.findMany({
      where: {
        receiver_id: userId,
        hidden_from_receiver: true,
      },
      include: {
        sender: { select: { id: true, username: true } },
      },
    });

    return spamRequests.map(r => ({
      id: r.id,
      senderId: r.sender_id,
      senderUsername: r.sender.username,
      message: r.message,
      status: r.status,
      created_at: r.created_at,
    }));
  }



    async getMessagesBetween(userId: number, withUserId: number) {
    // ✅ mark ข้อความที่ยังไม่อ่าน ให้เป็น is_read
    await this.prisma.message.updateMany({
      where: {
        receiver_id: userId,
        sender_id: withUserId,
        is_read: false,
      },
      data: {
        is_read: true,
      },
    });

    // ✅ ดึงข้อความทั้งหมดของห้องแชทนี้
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { sender_id: userId, receiver_id: withUserId },
          { sender_id: withUserId, receiver_id: userId },
        ],
      },
      orderBy: { sent_at: 'asc' },
      select: {
        id: true,
        content: true,
        sent_at: true,
        sender_id: true,
        receiver_id: true,
        is_request: true,
        is_read: true,
        is_delivered: true,
        is_failed: true,
      },
    });

    return { messages };
  }

// ✅ เริ่มการโทร แต่ยังไม่เริ่มนับเวลา
  async startCall(callerId: number, receiverId: number, type: 'VOICE' | 'VIDEO') {
    const call = await this.prisma.call.create({
      data: {
        caller_id: callerId,
        receiver_id: receiverId,
        type,
        status: 'RINGING', // เพิ่มสถานะ
      },
    });

    return { callId: call.id, status: call.status };
  }


  // ✅ จบการโทร
  async endCall(callId: number) {
    const call = await this.prisma.call.findUnique({ where: { id: callId } });

    if (!call || call.ended_at || call.status === 'DECLINED') {
      throw new BadRequestException('Call not found, already ended, or was declined');
    }

    if (!call.started_at) {
      throw new BadRequestException('Call was never accepted');
    }

    const ended = new Date();
    const duration = Math.floor((ended.getTime() - call.started_at.getTime()) / 1000);

    const updated = await this.prisma.call.update({
      where: { id: callId },
      data: {
        ended_at: ended,
        duration,
        status: 'ENDED', // ✅ เพิ่มสถานะ
      },
    });

    return { duration: updated.duration, ended_at: updated.ended_at };
  }


 async acceptCall(callId: number, userId: number) {
    const call = await this.prisma.call.findUnique({ where: { id: callId } });

    if (!call || call.status !== 'RINGING') {
      throw new BadRequestException('Call not found or not in RINGING status');
    }

    // ❌ ตรวจสอบว่า userId ต้องเป็น receiver เท่านั้น!
    if (call.receiver_id !== userId) {
      throw new BadRequestException('Only the receiver can accept the call');
    }

    const started = new Date();
    const updated = await this.prisma.call.update({
      where: { id: callId },
      data: {
        started_at: started,
        status: 'ONGOING',
      },
    });

    return { message: 'Call accepted', started_at: updated.started_at };
  }

  async declineCall(callId: number, userId: number) {
    const call = await this.prisma.call.findUnique({ where: { id: callId } });

    if (!call || call.status !== 'RINGING') {
      throw new BadRequestException('Call not found or not in RINGING status');
    }

    // ❌ ตรวจสอบว่า userId ต้องเป็น receiver เท่านั้น!
    if (call.receiver_id !== userId) {
      throw new BadRequestException('Only the receiver can decline the call');
    }

    const updated = await this.prisma.call.update({
      where: { id: callId },
      data: {
        status: 'DECLINED',
      },
    });

    return { message: 'Call declined' };
  }

  async cancelCall(callId: number, userId: number) {
    const call = await this.prisma.call.findUnique({ where: { id: callId } });

    if (!call) {
      throw new BadRequestException('Call not found');
    }

    // ✅ ต้องเป็นคนโทรเท่านั้นถึงจะยกเลิกได้
    if (call.caller_id !== userId) {
      throw new BadRequestException('Only the caller can cancel the call');
    }

    // ✅ ต้องยังไม่รับสาย
    if (call.started_at) {
      throw new BadRequestException('Cannot cancel a call that was already accepted');
    }

    const updated = await this.prisma.call.update({
      where: { id: callId },
      data: {
        status: CallStatus.CANCELED,
      },
    });

    return { message: 'Call canceled by caller' };
  }

  async getIncomingCall(userId: number) {
    const call = await this.prisma.call.findFirst({
      where: {
        receiver_id: userId,
        status: 'RINGING',
        started_at: null,
      },
      include: {
        caller: {
          select: {
            id: true,
            username: true,
            profile_picture: true, // ✅ ใช้อันนี้แทน imagePath
          },
        },
      },
    });

    if (!call) return { call: null };

    return {
      call: {
        id: call.id,
        callerId: call.caller_id,
        callerName: call.caller.username,
        callerAvatar: call.caller.profile_picture, // ✅ ตรงกับ Prisma
      },
    };
  }

  async getCallStatus(callId: number, userId: number) {
    const call = await this.prisma.call.findUnique({
      where: { id: callId },
      select: {
        id: true,
        caller_id: true,       // ✅ เพิ่มตรงนี้
        receiver_id: true,     // ✅ และตรงนี้
        status: true,
        started_at: true,
        ended_at: true,
        duration: true,
      },
    });

    if (!call) {
      throw new NotFoundException('Call not found');
    }

    if (call.caller_id !== userId && call.receiver_id !== userId) {
      throw new BadRequestException('You are not part of this call');
    }

    return {
      id: call.id,
      caller_id: call.caller_id,             // ✅ ต้อง return ด้วย
      receiver_id: call.receiver_id,         // ✅ เช่นกัน
      status: call.status,
      started_at: call.started_at,
      ended_at: call.ended_at,
      duration: call.duration,
    };
  }



}
  
