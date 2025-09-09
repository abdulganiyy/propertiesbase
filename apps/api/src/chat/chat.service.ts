// src/chat/chat.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async ensureParticipant(conversationId: string, userId: string) {
    const p = await this.prisma.chat.findUnique({
      where: { id:conversationId, OR:[
        {ownerId:userId},
        {userId}
      ]},
    });
    if (!p) throw new ForbiddenException('Not a participant of this conversation');
    return p;
  }

  async createConversationForProperty(propertyId: string, userId: string) {
    // auto-create with owner + user as participants
    const prop = await this.prisma.property.findUnique({ where: { id: propertyId }, include: { owner: true }});
    if (!prop) throw new NotFoundException('Property not found');

    const existing = await this.prisma.chat.findFirst({
      where: {
        propertyId,
       
      },
      include: { property: true },
    });
    if (existing) return existing;

    return this.prisma.chat.create({data:
      {propertyId,
        userId, 
        ownerId:prop.ownerId
      }
    });
  }

  async sendMessage(conversationId: string, authorId: string, body: string) {
    await this.ensureParticipant(conversationId, authorId);
    return this.prisma.message.create({
      data: { chatId:conversationId, senderId:authorId, message:body },
      include: { sender: true },
    });
  }

  async markRead(conversationId: string,messageId: string, userId: string) {
    await this.ensureParticipant(conversationId, userId);
    return this.prisma.message.update({
      where:{id:messageId},
      data: { isRead:true },
    });
  }

  async history(conversationId: string, userId: string, cursor?: string) {
    await this.ensureParticipant(conversationId, userId);
    return this.prisma.message.findMany({
      where: { chatId:conversationId },
      orderBy: { created_at: 'asc' },
      take: 30,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
  }

    async userconversations( userId: string) {
    const chats = await this.prisma.chat.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { userId: userId },
        ],
        isDeleted: false,
      },
      include: {
        property: true,
        owner: {
          select: { id: true, firstname: true,  lastname: true,email: true },
        },
        user: {
          select: { id: true, firstname: true,lastname: true, email: true },
        },
        messages: {
          take: 1,
          orderBy: { created_at: 'desc' },
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });

    return chats;
  }
}
