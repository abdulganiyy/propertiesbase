"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Bell,
  ChevronDown,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
  Search,
  Heart,
  Calendar,
  BarChart3,
  Shield,
  Users,
  Building,
  Plus,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";

interface DashboardUser {
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "owner" | "admin" | "renter";
  unreadMessages?: number;
  favoriteCount?: number;
}

interface DashboardStats {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  subtitle?: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigationItems: Record<string, Object[]> = {
  user: [
    { href: "/dashboard?tab=overview", label: "Overview", icon: Home },
    { href: "/dashboard?tab=saved", label: "Saved Properties", icon: Heart },
    { href: "/dashboard?tab=messages", label: "Messages", icon: MessageSquare },
    { href: "/dashboard?tab=viewings", label: "Viewings", icon: Calendar },
    { href: "/dashboard?tab=profile", label: "Profile", icon: User },
  ],
  renter: [
    { href: "/dashboard/renter", label: "Overview", icon: Home },
    {
      href: "/dashboard/renter?tab=saved",
      label: "Saved Properties",
      icon: Heart,
    },
    {
      href: "/dashboard/renter?tab=applications",
      label: "Applications",
      icon: Building,
    },
    {
      href: "/dashboard/renter?tab=alerts",
      label: "Search Alerts",
      icon: Bell,
    },
    { href: "/dashboard/renter?tab=history", label: "History", icon: Calendar },
    {
      href: "/dashboard/renter?tab=preferences",
      label: "Preferences",
      icon: Settings,
    },
  ],
  owner: [
    { href: "/dashboard/owner?tab=overview", label: "Overview", icon: Home },
    {
      href: "/dashboard/owner?tab=properties",
      label: "Properties",
      icon: Building,
    },
    // {
    //   href: "/dashboard/owner?tab=inquiries",
    //   label: "Inquiries",
    //   icon: MessageSquare,
    // },
    {
      href: "/dashboard/owner?tab=viewings",
      label: "Viewings",
      icon: Calendar,
    },
    {
      href: "/dashboard/owner?tab=analytics",
      label: "Analytics",
      icon: BarChart3,
    },
  ],
  admin: [
    { href: "/dashboard/admin?tab=overview", label: "Overview", icon: Home },
    { href: "/dashboard/admin?tab=users", label: "Users", icon: Users },
    {
      href: "/dashboard/admin?tab=properties",
      label: "Properties",
      icon: Building,
    },
    // {
    //   href: "/dashboard/admin?tab=reports",
    //   label: "Reports",
    //   icon: AlertTriangle,
    // },
    // {
    //   href: "/dashboard/admin?tab=analytics",
    //   label: "Analytics",
    //   icon: BarChart3,
    // },
  ],
};

const quickActions: Record<string, Object[]> = {
  user: [
    { href: "/listings", label: "Browse Properties", icon: Search },
    { href: "/chat", label: "Messages", icon: MessageSquare },
  ],
  renter: [
    { href: "/listings", label: "Search Properties", icon: Search },
    { href: "/messages", label: "Messages", icon: MessageSquare },
  ],
  owner: [
    {
      href: "/dashboard/owner?tab=properties",
      label: "Add Property",
      icon: Plus,
    },
    { href: "/chat", label: "Messages", icon: MessageSquare },
  ],
  admin: [
    // {
    //   href: "/dashboard/admin?tab=reports",
    //   label: "Reports",
    //   icon: AlertTriangle,
    // },
    { href: "/dashboard/admin?tab=users", label: "Manage Users", icon: Users },
  ],
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: user, isLoading, error } = useUser();

  const queryClient = useQueryClient();

  // console.log(user);

  const params = useSearchParams();

  const activeTab = params.get("tab");

  const [subtitle, setSubtitle] = useState<string>(
    "Here's what's happening with your property search"
  );

  // const [stats, setStats] = useState<DashboardStats[]>([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const role: string = user?.role ? user.role : "user";

  const navigation = navigationItems[role] || navigationItems.user;
  const actions = quickActions[role] || quickActions.user;

  const handleSignOut = () => {
    Cookies.remove("token");
    queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    router.replace("/signin");
    window.location.href = "/signin";
  };

  const isActiveRoute = (href: string) => {
    if (href.includes("?")) {
      const [basePath, tab] = href.split("?");
      return pathname === basePath && tab.includes(activeTab as string);
    }
    return pathname === href;
  };

  const name = user?.firstname + " " + user?.lastname;

  const headerActions = (
    <div className="flex items-center gap-4">
      <Button variant="outline" asChild>
        <Link href="/listings">
          <Search className="h-4 w-4 mr-2" />
          Browse Properties
        </Link>
      </Button>
      <Button asChild>
        <Link href="/chat">
          <MessageSquare className="h-4 w-4 mr-2" />
          Messages
          {user?.messagesUnread > 0 && (
            <Badge className="ml-2 bg-red-500">{user?.messagesUnread}</Badge>
          )}
        </Link>
      </Button>
    </div>
  );

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">PropertiesBase</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            <Badge variant="outline" className="mt-1 text-xs capitalize">
              {user?.role}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item: any) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
              {item.label === "Messages" &&
                user?.unreadMessages &&
                user?.unreadMessages > 0 && (
                  <Badge className="ml-auto bg-red-500 text-xs">
                    {user?.unreadMessages}
                  </Badge>
                )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Quick Actions
        </p>
        <div className="space-y-2">
          {actions.map((action: any) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-2xl font-bold text-gray-900">{`Welcome back, ${user?.firstname}!`}</h1>
                <p className="text-sm text-gray-500">
                  {role == "admin"
                    ? "Manage users, properties, and platform operations"
                    : subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {headerActions}

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {user?.unreadMessages && user?.unreadMessages > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center p-0">
                    {user?.unreadMessages}
                  </Badge>
                )}
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard?tab=profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem> */}
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Stats cards */}

        {/* Main content area */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">{children}</div>
      </div>
    </div>
  );
}
