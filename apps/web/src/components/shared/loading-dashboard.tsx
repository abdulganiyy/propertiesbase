import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MessageSquare, Search, Calendar } from "lucide-react";

interface LoadingDashboardProps {
  userRole: "user" | "owner" | "admin" | "renter";
  title: string;
  subtitle: string;
}

export function LoadingDashboard({
  userRole,
  title,
  subtitle,
}: LoadingDashboardProps) {
  const mockUser = {
    name: "Loading...",
    email: "loading@example.com",
    avatar: "/placeholder.svg",
    role: userRole,
    unreadMessages: 0,
    favoriteCount: 0,
  };

  const mockStats = [
    {
      title: "Loading...",
      value: "...",
      icon: <Heart className="h-8 w-8" />,
      color: "text-gray-400",
      subtitle: "Loading...",
    },
    {
      title: "Loading...",
      value: "...",
      icon: <Search className="h-8 w-8" />,
      color: "text-gray-400",
      subtitle: "Loading...",
    },
    {
      title: "Loading...",
      value: "...",
      icon: <MessageSquare className="h-8 w-8" />,
      color: "text-gray-400",
      subtitle: "Loading...",
    },
    {
      title: "Loading...",
      value: "...",
      icon: <Calendar className="h-8 w-8" />,
      color: "text-gray-400",
      subtitle: "Loading...",
    },
  ];

  return (
    <DashboardLayout
      user={mockUser}
      stats={mockStats}
      title={title}
      subtitle={subtitle}
      headerActions={
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      }
    >
      <div className="space-y-6">
        {/* Tabs Skeleton */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[...Array(userRole === "renter" ? 6 : 5)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-md" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="p-3 border rounded-lg space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
