import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getMyProfile(req: Request) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            created_at: true,
            images: {
              select: {
                image_url: true,
              },
            },
          },
        },
        connections_as_user1: true,
        connections_as_user2: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const followers = await this.prisma.connection.count({
      where: { user2_id: Number(userId), status: 'ACCEPTED' },
    });

    const following = await this.prisma.connection.count({
      where: { user1_id: Number(userId), status: 'ACCEPTED' },
    });

    const age = user.date_of_birth ? Math.floor((new Date().getTime() - user.date_of_birth.getTime()) / (1000 * 60 * 60 * 24 * 365)) : null;

    return {
      id: user.id,
      username: user.username,
      followers: followers,
      following: following,
      profilePicture: user.profile_picture || 'http://example.com/default.jpg',
      coverPhoto: user.cover_photo || 'http://example.com/default-cover.jpg',
      aboutMe: user.about_me || '',
      knowledgeInterests: user.knowledge_interests || [],
      posts: user.posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        images: post.images.map(img => img.image_url),
        created_at: post.created_at,
      })),
      lastActive: user.last_active,
      age: age,
    };
  }

  async updateMyProfile(req: Request, data: { profilePicture?: string; coverPhoto?: string; aboutMe?: string; knowledgeInterests?: string[] }) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const { profilePicture, coverPhoto, aboutMe, knowledgeInterests } = data;

    if (knowledgeInterests && !Array.isArray(knowledgeInterests)) {
      throw new BadRequestException('Knowledge interests must be an array');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: Number(userId) },
      data: {
        profile_picture: profilePicture,
        cover_photo: coverPhoto,
        about_me: aboutMe,
        knowledge_interests: knowledgeInterests,
        last_active: new Date(),
      },
    });

    return {
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        profile_picture: updatedUser.profile_picture,
        cover_photo: updatedUser.cover_photo,
        about_me: updatedUser.about_me,
        knowledge_interests: updatedUser.knowledge_interests,
        last_active: updatedUser.last_active,
      },
    };
  }

  async getUserProfile(userId: number, currentUserId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            created_at: true,
            images: {
              select: {
                image_url: true,
              },
            },
          },
        },
        connections_as_user1: true,
        connections_as_user2: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const followers = await this.prisma.connection.count({
      where: { user2_id: userId, status: 'ACCEPTED' },
    });

    const following = await this.prisma.connection.count({
      where: { user1_id: userId, status: 'ACCEPTED' },
    });

    const isFollowing = await this.prisma.connection.findFirst({
      where: {
        user1_id: currentUserId,
        user2_id: userId,
        status: 'ACCEPTED',
      },
    });

    return {
      id: user.id,
      username: user.username,
      profilePicture: user.profile_picture || 'http://example.com/default.jpg',
      coverPhoto: user.cover_photo || 'http://example.com/default-cover.jpg',
      aboutMe: user.about_me || '',
      knowledgeInterests: user.knowledge_interests || [],
      followers: followers,
      following: following,
      posts: user.posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        images: post.images.map(img => img.image_url),
        created_at: post.created_at,
      })),
      isFollowing: !!isFollowing,
    };
  }

  async followUser(userIdToFollow: number, currentUserId: number) {
    const existingConnection = await this.prisma.connection.findFirst({
      where: {
        user1_id: currentUserId,
        user2_id: userIdToFollow,
      },
    });

    if (existingConnection) {
      if (existingConnection.status === 'ACCEPTED') {
        throw new BadRequestException('Already following this user');
      }
      await this.prisma.connection.update({
        where: { id: existingConnection.id },
        data: { status: 'ACCEPTED' },
      });
    } else {
      await this.prisma.connection.create({
        data: {
          user1_id: currentUserId,
          user2_id: userIdToFollow,
          status: 'ACCEPTED',
        },
      });
    }

    return {
      message: 'Successfully followed user',
      userId: userIdToFollow,
      followerId: currentUserId,
    };
  }

  async unfollowUser(userIdToUnfollow: number, currentUserId: number) {
    const connection = await this.prisma.connection.findFirst({
      where: {
        user1_id: currentUserId,
        user2_id: userIdToUnfollow,
      },
    });

    if (!connection) {
      throw new NotFoundException('Not following this user');
    }

    await this.prisma.connection.delete({
      where: { id: connection.id },
    });

    return {
      message: 'Successfully unfollowed user',
      userId: userIdToUnfollow,
      followerId: currentUserId,
    };
  }

  // async requestConnect(receiverId: number, senderId: number, message: string) {
  //   const existingRequest = await this.prisma.chatRequest.findUnique({
  //     where: { sender_id_receiver_id: { sender_id: senderId, receiver_id: receiverId } },
  //   });

  //   if (existingRequest) {
  //     throw new BadRequestException('Connection request already exists');
  //   }

  //   const request = await this.prisma.chatRequest.create({
  //     data: {
  //       sender_id: senderId,
  //       receiver_id: receiverId,
  //       message,
  //       status: 'PENDING',
  //     },
  //   });

  //   return {
  //     message: 'Connection request sent',
  //     requestId: request.id,
  //     senderId: senderId,
  //     receiverId: receiverId,
  //   };
  // }

  // kate edit ให้มันส่งซ้ำได้ มีการเปลี่ยน findfirst
  async requestConnect(receiverId: number, senderId: number, message: string) {
  const existingRequest = await this.prisma.chatRequest.findFirst({
    where: {
      sender_id: senderId,
      receiver_id: receiverId,
      status: 'PENDING', // ✅ ตรวจเฉพาะ request ที่ยังค้างอยู่
    },
  });

  if (existingRequest) {
    throw new BadRequestException('A pending connection request already exists');
  }

  const request = await this.prisma.chatRequest.create({
    data: {
      sender_id: senderId,
      receiver_id: receiverId,
      message,
      status: 'PENDING',
    },
  });

  return {
    message: 'Connection request sent',
    requestId: request.id,
    senderId: senderId,
    receiverId: receiverId,
  };
}

// kate create
// async cancelRegistration(email: string) {
//   const user = await this.prisma.user.findUnique({
//     where: { email },
//     include: { otps: true },
//   });

//   if (!user) {
//     throw new NotFoundException('User not found');
//   }

//   if (user.role !== 'GUEST') {
//     throw new BadRequestException('Cannot delete verified user');
//   }

//   await this.prisma.otp.deleteMany({
//     where: { user_id: user.id },
//   });

//   await this.prisma.user.delete({
//     where: { email },
//   });

//   return {
//     success: true,
//     message: 'User registration cancelled successfully',
//     timestamp: new Date().toISOString(),
//   };
// }
async getAllUsers() {
  const users = await this.prisma.user.findMany({
    select: {
      id: true,
      username: true,
      profile_picture: true,
      cover_photo: true,
      about_me: true,
      knowledge_interests: true,
      created_at: true,
    },
    orderBy: { created_at: 'desc' },
  });

  return {
    success: true,
    message: 'Fetched all users successfully',
    timestamp: new Date().toISOString(),
    data: users,
  };
}




}
