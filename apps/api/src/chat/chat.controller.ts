// src/chat/chat.controller.ts
import { Controller, Get, Param, Query, Post, Body, UseGuards,Request } from '@nestjs/common';
import { WsJwtGuard } from './ws-jwt.guard';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private chat: ChatService) {}


   @Get()
   chats(@Request() req:any) {
    return this.chat.userconversations(req.user.id);
  }

  @Post('property/:propertyId/conversation')
  createConversation(@Param('propertyId') propertyId: string, @Request() req:any) {
    return this.chat.createConversationForProperty(propertyId, req.user.id)
  }

  @Get('conversation/:id/history')
  history(@Param('id') id: string, @Query('cursor') cursor: string | undefined, @Query('userId') userId: string) {
    return this.chat.history(id, userId, cursor);
  }
}
