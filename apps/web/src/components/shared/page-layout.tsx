import type React from "react";
import { Header } from "./header";
import { Footer } from "./footer";

interface PageLayoutProps {
  children: React.ReactNode;
  headerVariant?: "default" | "search" | "minimal";
  footerVariant?: "default" | "minimal";
  showSearch?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    unreadMessages?: number;
    favoriteCount?: number;
  };
}

export function PageLayout({
  children,
  headerVariant = "default",
  footerVariant = "default",
  showSearch = false,
  user,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant={headerVariant} showSearch={showSearch} />
      <main className="flex-1">{children}</main>
      <Footer variant={footerVariant} />
    </div>
  );
}
