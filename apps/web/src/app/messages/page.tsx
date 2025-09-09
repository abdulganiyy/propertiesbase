"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/components/shared/page-layout";
import { ChatInterface } from "@/app/messages/_components/chat-interface";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";

export default function MessagesPage() {
  const { data: user, isLoading, isError } = useUser();
  // const [user, setUser] = useState<any>({
  //   name: "Ade Bayo",
  //   email: "adde@gmail.com",
  // });

  // useEffect(() => {
  //   const userData = localStorage.getItem("user");
  //   if (userData) {
  //     setUser(JSON.parse(userData));
  //   }
  // }, []);

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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">
              Connect with property owners and renters
            </p>
          </div>

          <ChatInterface
            currentUserId={user.id || "current-user"}
            currentUserName={user.name}
          />
        </div>
      </div>
    </PageLayout>
  );
}
