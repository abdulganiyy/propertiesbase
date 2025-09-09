// src/chat/chat.gateway.ts
import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { WsJwtGuard } from './ws-jwt.guard';
import { ChatEvents } from './chat.events';
import { JoinConversationDto, SendMessageDto, ReadDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: true 
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  constructor(private chat: ChatService, private jwt: JwtService) {}

//   @UseGuards(WsJwtGuard)
  async handleConnection(@ConnectedSocket() client: Socket) {
    // const user = client['user'];
    // console.log(user,client.handshake.auth.token,"########")
    const res = await this.jwt.verifyAsync(client.handshake.auth.token)

    client.emit(ChatEvents.CONNECTED, { userId: res.id })
    // optional presence broadcast
    this.server.emit(ChatEvents.PRESENCE, { userId: res.id, online: true });
  }


  handleDisconnect(@ConnectedSocket() client: Socket) {
    const user = (client as any).user;
    this.server.emit(ChatEvents.PRESENCE, { userId: user?.id, online: false });
  }

  // @UseGuards(WsJwtGuard)
  @SubscribeMessage(ChatEvents.JOIN_CONVERSATION)
  async onJoin(@ConnectedSocket() client: Socket, @MessageBody() dto: JoinConversationDto) {
    const res = await this.jwt.verifyAsync(client.handshake.auth.token)
    // const userId = (client as any).user.id as string;
    const userId = res.id
    await this.chat.ensureParticipant(dto.conversationId, userId);
    client.join(`conversation:${dto.conversationId}`);
    const messages = await this.chat.history(dto.conversationId, userId);
    this.server.to(`conversation:${dto.conversationId}`).emit(ChatEvents.HISTORY,messages);

  }

  @SubscribeMessage(ChatEvents.LEAVE_CONVERSATION)
  async onLeave(@ConnectedSocket() client: Socket, @MessageBody() dto: JoinConversationDto) {
    client.leave(`conversation:${dto.conversationId}`);
  }

  @SubscribeMessage(ChatEvents.SEND_MESSAGE)
  async onSend(@ConnectedSocket() client: Socket, @MessageBody() dto: SendMessageDto) {
    // const userId = (client as any).user.id as string;
    // console.log(dto,userId);
   const res = await this.jwt.verifyAsync(client.handshake.auth.token)
   const userId = res.id

    const msg = await this.chat.sendMessage(dto.conversationId, userId, dto.body);
    this.server.to(`conversation:${dto.conversationId}`).emit(ChatEvents.MESSAGE_CREATED, msg);
  }

  // @SubscribeMessage(ChatEvents.TYPING_START)
  // async onTypingStart(@ConnectedSocket() client: Socket, @MessageBody() dto: JoinConversationDto) {
  //   const userId = (client as any).user.id as string;
  //   client.to(`conversation:${dto.conversationId}`).emit(ChatEvents.TYPING_START, { conversationId: dto.conversationId, userId });
  // }

  // @SubscribeMessage(ChatEvents.TYPING_STOP)
  // async onTypingStop(@ConnectedSocket() client: Socket, @MessageBody() dto: JoinConversationDto) {
  //   const userId = (client as any).user.id as string;
  //   client.to(`conversation:${dto.conversationId}`).emit(ChatEvents.TYPING_STOP, { conversationId: dto.conversationId, userId });
  // }

  // @SubscribeMessage(ChatEvents.READ)
  // async onRead(@ConnectedSocket() client: Socket, @MessageBody() dto: ReadDto) {
  //   const userId = (client as any).user.id as string;
  //   const p = await this.chat.markRead(dto.conversationId,dto.messageId, userId);
  //   this.server.to(`conversation:${dto.conversationId}`).emit(ChatEvents.READ, { conversationId: dto.conversationId, userId, at: p.isRead });
  // }
}
