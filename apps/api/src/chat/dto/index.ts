import { IsString, IsNotEmpty } from 'class-validator';

export class JoinConversationDto {
  @IsString() @IsNotEmpty()
  conversationId!: string;
}

export class SendMessageDto {
  @IsString() @IsNotEmpty()
  conversationId!: string;

  @IsString() @IsNotEmpty()
  body!: string;
}

export class ReadDto {
  @IsString() @IsNotEmpty()
  conversationId!: string;

  @IsString() @IsNotEmpty()
  messageId!: string;
}
