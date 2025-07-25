// src/talk/talk.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TalkService } from './talk.service';

@WebSocketGateway({ cors: true })
export class TalkGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private connectedUsers = new Map<number, string>(); // userId -> socketId

  constructor(private talkService: TalkService) {}

  handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    if (userId) {
      this.connectedUsers.set(userId, client.id);
      console.log(`User ${userId} connected with socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    const disconnectedUser = [...this.connectedUsers.entries()].find(([, socketId]) => socketId === client.id);
    if (disconnectedUser) {
      this.connectedUsers.delete(disconnectedUser[0]);
      console.log(`User ${disconnectedUser[0]} disconnected`);
    }
  }

  // ✅ ส่งข้อความ
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { senderId: number; receiverId: number; content: string },
    @ConnectedSocket() client: Socket
  ) {
    const saved = await this.talkService.sendMessage(data.senderId, data.receiverId, data.content);

    // ส่งให้ receiver ถ้าออนไลน์
    const receiverSocket = this.connectedUsers.get(data.receiverId);
    if (receiverSocket) {
      this.server.to(receiverSocket).emit('receive_message', saved.message);
    }

    // ส่งกลับให้ sender (optional)
    client.emit('message_sent', saved.message);
  }

 @SubscribeMessage('start_call')
async handleStartCall(
  @MessageBody() data: { callerId: number; receiverId: number; type: 'VOICE' | 'VIDEO' },
  @ConnectedSocket() client: Socket
) {
  const call = await this.talkService.startCall(data.callerId, data.receiverId, data.type);
  const receiverSocket = this.connectedUsers.get(data.receiverId);

  if (receiverSocket) {
    this.server.to(receiverSocket).emit('incoming_call', {
      callId: call.callId,
      from: data.callerId,
      type: data.type,
    });
  }

  // ✅ ส่งกลับให้ client ฝั่ง caller
  client.emit('call_started', { callId: call.callId });

  return call; // optional
}


  // ✅ ยอมรับสาย
  @SubscribeMessage('accept_call')
  async handleAcceptCall(
    @MessageBody() data: { callId: number; receiverId: number }
  ) {
    const result = await this.talkService.acceptCall(data.callId, data.receiverId);
    const call = await this.talkService.getCallStatus(data.callId, data.receiverId);

    const callerSocket = this.connectedUsers.get(call.caller_id);
    if (callerSocket) {
      this.server.to(callerSocket).emit('call_accepted', call);
    }

    return result;
  }

  // ✅ ปฏิเสธสาย
  @SubscribeMessage('decline_call')
  async handleDeclineCall(@MessageBody() data: { callId: number; receiverId: number }) {
    const result = await this.talkService.declineCall(data.callId, data.receiverId);

    const call = await this.talkService.getCallStatus(data.callId, data.receiverId);
    const callerSocket = this.connectedUsers.get(call.caller_id);
    if (callerSocket) {
      this.server.to(callerSocket).emit('call_declined', { callId: call.id });
    }

    return result;
  }

    // ✅ วางสาย
  @SubscribeMessage('end_call')
  async handleEndCall(@MessageBody() data: { callId: number; userId: number }) {
    const result = await this.talkService.endCall(data.callId);
    
    // ส่งสถานะอัปเดตกลับให้ caller + receiver
    const call = await this.talkService.getCallStatus(data.callId, data.userId);
    const callerSocket = this.connectedUsers.get(call.caller_id);
    const receiverSocket = this.connectedUsers.get(call.receiver_id);

    if (callerSocket) this.server.to(callerSocket).emit('call_ended', call);
    if (receiverSocket) this.server.to(receiverSocket).emit('call_ended', call);

    return result;
  }

  // ✅ ยกเลิกสาย (ก่อนรับ)
  @SubscribeMessage('cancel_call')
  async handleCancelCall(@MessageBody() data: { callId: number; userId: number }) {
    const result = await this.talkService.cancelCall(data.callId, data.userId);

    // ส่งสถานะให้ฝั่ง receiver
    const call = await this.talkService.getCallStatus(data.callId, data.userId);
    const receiverSocket = this.connectedUsers.get(call.receiver_id);
    if (receiverSocket) this.server.to(receiverSocket).emit('call_canceled', { callId: call.id });

    return result;
  }

  @SubscribeMessage('webrtc_offer')
  handleWebRtcOffer(
    @MessageBody() data: { from: number; to: number; sdp: any }
  ) {
    const receiverSocket = this.connectedUsers.get(data.to);
    if (receiverSocket) {
      this.server.to(receiverSocket).emit('webrtc_offer', {
        from: data.from,
        sdp: data.sdp,
      });
    }
  }

  @SubscribeMessage('webrtc_answer')
  handleWebRtcAnswer(
    @MessageBody() data: { from: number; to: number; sdp: any }
  ) {
    const receiverSocket = this.connectedUsers.get(data.to);
    if (receiverSocket) {
      this.server.to(receiverSocket).emit('webrtc_answer', {
        from: data.from,
        sdp: data.sdp,
      });
    }
  }

  @SubscribeMessage('ice_candidate')
  handleIceCandidate(
    @MessageBody() data: { from: number; to: number; candidate: any }
  ) {
    const receiverSocket = this.connectedUsers.get(data.to);
    if (receiverSocket) {
      this.server.to(receiverSocket).emit('ice_candidate', {
        from: data.from,
        candidate: data.candidate,
      });
    }
  }



}
