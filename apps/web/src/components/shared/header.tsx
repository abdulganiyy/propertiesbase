"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Search,
  Menu,
  User,
  Heart,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/hooks/use-user";

interface HeaderProps {
  variant?: "default" | "search" | "minimal";
  showSearch?: boolean;
  // user?: {
  //   name: string;
  //   email: string;
  //   avatar?: string;
  //   unreadMessages?: number;
  //   favoriteCount?: number;
  // };
}

export function Header({
  variant = "default",
  showSearch = false,
  // user,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { data: user } = useUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navigationItems = [
    { href: "/", label: "Home", active: pathname === "/" },
    {
      href: "/listings",
      label: "Browse Properties",
      active: pathname === "/listings",
    },
    {
      href: "/signup/owner",
      label: "List Property",
      active: pathname === "/signup/owner",
    },
    // {
    //   href: "/how-it-works",
    //   label: "How It Works",
    //   active: pathname === "/how-it-works",
    // },
    // { href: "/about", label: "About", active: pathname === "/about" },
  ];

  const dashboardLink: any = {
    user: "/dashboard",
    owner: "/dashboard/owner",
    admin: "/dashboard/admin",
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.imageUrl || "/placeholder.svg"}
              alt={user?.name}
            />
            <AvatarFallback>
              {`${user?.firstname} ${user?.lastname}`
                ?.split(" ")
                .map((n: any) => n[0])
                .join("")
                .toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {user?.unreadMessages && user.unreadMessages > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
              {user.unreadMessages > 9 ? "9+" : user.unreadMessages}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user?.name}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/favorites" className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            Favorites
            {user?.favoriteCount && user.favoriteCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {user.favoriteCount}
              </Badge>
            )}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/messages" className="cursor-pointer">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
            {user?.unreadMessages && user.unreadMessages > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {user.unreadMessages}
              </Badge>
            )}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/properties" className="cursor-pointer">
            <Home className="mr-2 h-4 w-4" />
            My Properties
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const MobileMenu = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] px-4 pt-4">
        <div className="flex flex-col space-y-4">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">PropertiesBase</span>
          </Link>

          {showSearch && (
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          )}

          <nav className="flex flex-col space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {!user && (
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                asChild
              >
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  if (variant === "minimal") {
    return (
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">PropertiesBase</span>
            </Link>
            <div className="flex items-center gap-2">
              {user ? (
                <Link href={dashboardLink[user.role]}>Dashboard</Link>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">PropertiesBase</span>
          </Link>

          {/* Search Bar - Desktop */}
          {/* {showSearch && (
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md mx-8"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  className="pl-10 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          )} */}

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  item.active
                    ? "text-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            {/* {user && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  asChild
                >
                  <Link href="/notifications">
                    <Bell className="h-4 w-4" />
                    {user.unreadMessages && user.unreadMessages > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs">
                        {user.unreadMessages > 9 ? "9+" : user.unreadMessages}
                      </Badge>
                    )}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex"
                  asChild
                >
                  <Link href="/list-property">
                    <Plus className="h-4 w-4 mr-2" />
                    List Property
                  </Link>
                </Button>
              </>
            )} */}

            {user ? (
              <Button size="sm" asChild>
                <Link href={dashboardLink[user.role]}>Dashboard</Link>
              </Button>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            <MobileMenu />
          </div>
        </div>
      </div>

      {/* Search Bar - Mobile */}
      {showSearch && (
        <div className="md:hidden border-t bg-white px-4 py-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search properties..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </header>
  );
}
