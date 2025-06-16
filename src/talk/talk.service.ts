import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TalkService {
  constructor(private prisma: PrismaService) {}

  async getRequests(userId: number) {
    const requests = await this.prisma.chatRequest.findMany({
      where: { receiver_id: userId, status: 'PENDING' },
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

  async acceptRequest(requestId: number, userId: number) {
    const request = await this.prisma.chatRequest.findUnique({
      where: { id: requestId },
    });
    if (!request || request.receiver_id !== userId) {
      throw new NotFoundException('Request not found or not authorized');
    }
    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request is not pending');
    }

    await this.prisma.chatRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });

    await this.prisma.connection.upsert({
      where: { user1_id_user2_id: { user1_id: request.sender_id, user2_id: userId } },
      update: { status: 'ACCEPTED' },
      create: { user1_id: request.sender_id, user2_id: userId, status: 'ACCEPTED' },
    });

    return { message: 'Connection request accepted', chatId: requestId };
  }

  async declineRequest(requestId: number, userId: number) {
    const request = await this.prisma.chatRequest.findUnique({
      where: { id: requestId },
    });
    if (!request || request.receiver_id !== userId) {
      throw new NotFoundException('Request not found or not authorized');
    }
    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request is not pending');
    }

    await this.prisma.chatRequest.update({
      where: { id: requestId },
      data: { status: 'DECLINED' },
    });

    return { message: 'Connection request declined' };
  }

  async getChats(userId: number) {
    const connections = await this.prisma.connection.findMany({
      where: { OR: [{ user1_id: userId }, { user2_id: userId }], status: 'ACCEPTED' },
      include: { user1: true, user2: true },
    });

    const chats: { userId: number; username: string; lastMessage: string; lastMessageTime: Date | null }[] = [];
    for (const conn of connections) {
      const otherUser = conn.user1_id === userId ? conn.user2 : conn.user1;
      const lastMessage = await this.prisma.message.findFirst({
        where: { OR: [{ sender_id: userId, receiver_id: otherUser.id }, { sender_id: otherUser.id, receiver_id: userId }] },
        orderBy: { sent_at: 'desc' }, // เปลี่ยนจาก created_at เป็น sent_at
      });
      chats.push({
        userId: otherUser.id,
        username: otherUser.username,
        lastMessage: lastMessage?.content || '',
        lastMessageTime: lastMessage?.sent_at || null, // เปลี่ยนจาก created_at เป็น sent_at
      });
    }

    return { chats };
  }

  async sendMessage(senderId: number, receiverId: number, content: string) {
    const connection = await this.prisma.connection.findUnique({
      where: { user1_id_user2_id: { user1_id: senderId, user2_id: receiverId } },
    });
    if (!connection || connection.status !== 'ACCEPTED') {
      throw new BadRequestException('Cannot send message to this user');
    }

    const message = await this.prisma.message.create({
      data: { sender_id: senderId, receiver_id: receiverId, content },
    });

    return { message: 'Message sent', messageId: message.id };
  }
}