"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import { useMutation , QueryClient} from "@tanstack/react-query";
import { api } from "@/lib/api";


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
  HISTORY:"history"
} as const;


export type ChatMessage = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: string;
};

export function useChat({
  chatId,
//   token,
}: {
  chatId: string;
//   token: string; // your JWT or userId for demo
}) {
  const [messages, setMessages] = useState<ChatMessage[] | any>([]);
  const [isTypingMap, setIsTypingMap] = useState<Record<string, boolean>>({});
  const socketRef = useRef<ReturnType<typeof getSocket>>(null);

  // join room & wire events
  useEffect(() => {
    const s = getSocket();
    socketRef.current = s;

    const onHistory = (data: ChatMessage[]) => setMessages(data);
    const onNew = (msg: ChatMessage) =>{
      console.log(msg)
      setMessages((prev:any) =>
        prev.some((m:any) => m.id === msg.id) ? prev : [...prev, msg]
      )}
    const onRead = (payload: { chatId: string; by: string }) => {
      if (payload.chatId === chatId) {
        setMessages((prev:any) => prev.map((m:any) => ({ ...m, read: true })));
      }
    };
    const onTyping = (payload: { userId: string; isTyping: boolean }) => {
      setIsTypingMap((prev) => ({ ...prev, [payload.userId]: payload.isTyping }));
    };

    s.emit(ChatEvents.JOIN_CONVERSATION, { conversationId:chatId });
    s.on(ChatEvents.HISTORY, onHistory);
    s.on(ChatEvents.MESSAGE_CREATED, onNew);
    s.on(ChatEvents.READ, onRead);
    s.on(ChatEvents.TYPING_START, onTyping);

    return () => {
      s.off(ChatEvents.HISTORY, onHistory);
      s.off(ChatEvents.MESSAGE_CREATED, onNew);
      s.off(ChatEvents.READ, onRead);
      s.off(ChatEvents.TYPING_START, onTyping);
      // s.emit("typing", { chatId, isTyping: false });
      // keep socket for other pages; if you want to close, call closeSocket()
    };
  }, [chatId]);

  const sendMessage = useCallback((content: string) => {
    console.log(content)
    socketRef.current?.emit(ChatEvents.SEND_MESSAGE, { conversationId:chatId, body:content });
  }, [chatId]);

  const markAsRead = useCallback(() => {
    socketRef.current?.emit(ChatEvents.READ, { chatId });
  }, [chatId]);

  const setTyping = useCallback((isTyping: boolean) => {
    socketRef.current?.emit(ChatEvents.TYPING_START, { conversationId: chatId, });
  }, [chatId]);

  const typingUsers = Object.entries(isTypingMap)
    .filter(([, v]) => v)
    .map(([k]) => k);

  

  return { messages, sendMessage, markAsRead, setTyping, typingUsers};
}


export const  useStartChat = () => useMutation({
      mutationFn: (data:any) =>
        api.sendMessage(data.propertyId,data.userId)
    });