
export const ChatEvents = {
  CONNECTED: 'connected',
  JOIN_CONVERSATION: 'conversation.join',
  LEAVE_CONVERSATION: 'conversation.leave',
  SEND_MESSAGE: 'message.send',
  MESSAGE_CREATED: 'message.created',
  TYPING_START: 'typing.start',
  TYPING_STOP: 'typing.stop',
  READ: 'message.read',
  PRESENCE: 'presence',
  HISTORY: 'history',

} as const;
