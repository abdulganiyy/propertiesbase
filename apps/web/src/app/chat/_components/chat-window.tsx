// components/ChatWindow.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatWindow({
  chatId,
  //   token,
  currentUserId,
}: {
  chatId: string;
  //   token: string;
  currentUserId: string;
}) {
  const { messages, sendMessage, markAsRead, setTyping, typingUsers } = useChat(
    { chatId }
  );
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  // auto-scroll
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // mark as read when messages arrive
  useEffect(() => {
    if (messages.length) markAsRead();
  }, [messages, markAsRead]);

  const typingLabel = useMemo(() => {
    const others = typingUsers.filter((id) => id !== currentUserId);
    if (!others.length) return "";
    if (others.length === 1) return "Typing...";
    return "Multiple people are typing...";
  }, [typingUsers, currentUserId]);

  const onSend = () => {
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
    // setTyping(false);
  };

  console.log(messages);

  return (
    <div className="flex flex-col h-[680px] w-full rounded-2xl border p-3 bg-white">
      <div ref={listRef} className="flex-1 overflow-y-auto space-y-2 pr-1">
        {messages.map((m: any) => (
          <div
            key={m.id}
            className={`max-w-[30%] rounded-xl px-3 py-2 text-sm shadow-sm ${
              m.senderId === currentUserId
                ? "ml-auto bg-blue-50"
                : "mr-auto bg-gray-100"
            }`}
            title={new Date(m.createdAt).toLocaleString()}
          >
            <div>{m.message}</div>
          </div>
        ))}
      </div>

      {typingLabel && (
        <div className="text-xs text-gray-500 mt-1">{typingLabel}</div>
      )}

      <div className="mt-2 flex gap-2">
        <Input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setTyping(!!e.target.value);
          }}
          onBlur={() => setTyping(false)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <Button onClick={onSend}>Send</Button>
      </div>
    </div>
  );
}
