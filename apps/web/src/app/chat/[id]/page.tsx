"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/components/shared/page-layout";
// import { ChatInterface } from "@/app/messages/_components/chat-interface";
import ChatWindow from "../_components/chat-window";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default function MessagesPage() {
  const { id } = useParams();

  const { data: user, isLoading, isError } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
        <p className="ml-2">Loading chat...</p>
      </div>
    );
  }

  //   if (isError) {
  //     return (
  //       <div className="flex items-center justify-center h-64 text-red-500">
  //         ⚠️ Failed to load chat. {"Please try again later."}
  //       </div>
  //     );
  //   }

  if (!user && !isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Please sign in to access messages
            </h2>
            <Link href="/signin">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      user={{
        name: user.name,
        email: user.email,
        avatar: "/hero-image.jpg",
        // unreadMessages: 3,
        // favoriteCount: 12,
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <ChatWindow chatId={id as string} currentUserId={user.id} />
        </div>
      </div>
    </PageLayout>
  );
}
