"use client";

import { Home, ChevronLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";

type Chat = {
  id: string;
  name: string; // could be user or group name
  lastMessage: string;
  lastMessageTime: string; // ISO string
  unreadCount: number;
};

export default function ChatList() {
  const { data: chats, isLoading: loading } = useQuery({
    queryKey: ["chats"],
    queryFn: () => api.fetchChats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: user } = useUser();

  const router = useRouter();

  if (loading) {
    return <div className="p-4 text-gray-500">Loading chats...</div>;
  }

  if (chats.length === 0) {
    return <div className="p-4 text-gray-500">No chats yet.</div>;
  }

  return (
    <>
      <Link href="/" className="flex items-center gap-2 mx-8 mt-4">
        <ChevronLeft className="h-5 w-5" />
        <Home className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">Go back</span>
      </Link>
      <div className="mx-8 mt-8 border rounded-xl shadow bg-white">
        <h1 className="text-xl font-semibold p-4 border-b">Chats</h1>
        <div className="divide-y divide-gray-200">
          {chats.map((chat: any) => (
            <div
              key={chat.id}
              onClick={() => router.push(`/chat/${chat.id}`)}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">
                  {user?.id == chat.owner?.id
                    ? `${chat.user?.firstname}  ${chat.user?.lastname}`
                    : `${chat.owner?.firstname}  ${chat.owner?.lastname}`}
                </span>

                <span className="font-normal text-gray-700">
                  {chat?.property?.title}
                </span>
                <span className="text-sm text-gray-600 truncate max-w-xs">
                  {chat?.messages[0]?.message}
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400">
                  {new Date(chat?.messages[0]?.created_at).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
                {chat.unreadCount > 0 && (
                  <span className="mt-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
