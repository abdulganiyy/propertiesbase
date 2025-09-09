"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageSquare, Search, Calendar, MapPin } from "lucide-react";
import { PropertyCard } from "@/components/shared/property-card";
import {
  useProperties,
  useViewings,
  useUserPropertiesViews,
  useFavorites,
} from "@/hooks/use-properties";
import Link from "next/link";
import { useUser, useUserStats } from "@/hooks/use-user";
import { formatDateTime } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import VerifyEmailDialog from "@/components/shared/verify-email-dialog";

export default function UserDashboard() {
  const { data: user, isLoading, error } = useUser();

  // console.log(user);
  const params = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    (params.get("tab") as string) ?? "overview"
  );

  useEffect(() => {
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab as string);
    }
  }, [params]);

  const { data: messages, isLoading: loading } = useQuery({
    queryKey: ["chats"],
    queryFn: () => api.fetchChats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // data for user's saved properties and recent searches
  // const { data: savedProperties } = useProperties({ limit: 6 });
  // const { data: recentlyViewed } = useUserPropertiesViews();
  const { data: favorites } = useFavorites();

  console.log(favorites);

  const { data: stats } = useUserStats();
  const { data: viewings } = useViewings();

  // console.log(viewings);

  // const stats = {
  //   savedProperties: 12,
  //   recentSearches: 8,
  //   messagesUnread: 3,
  //   scheduledViewings: 2,
  // };

  const dashboardStats = [
    {
      title: "Liked Properties",
      value: stats?.favoritedProperties || 0,
      icon: <Heart className="h-8 w-8" />,
      color: "text-red-500",
      subtitle: "+2 this week",
    },
    // {
    //   title: "Recent Searches",
    //   value: stats.recentSearches,
    //   icon: <Search className="h-8 w-8" />,
    //   color: "text-blue-500",
    //   subtitle: "Last search 2h ago",
    // },
    {
      title: "Unread Messages",
      value: stats?.unreadMessages || 0,
      icon: <MessageSquare className="h-8 w-8" />,
      color: "text-green-500",
      subtitle: "2 new today",
    },
    {
      title: "Scheduled Viewings",
      value: stats?.scheduledViewings || 0,
      icon: <Calendar className="h-8 w-8" />,
      color: "text-purple-500",
      subtitle: `Next: Tomorrow ${formatDateTime(viewings?.length && viewings[0].scheduledAt).time}`,
    },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Please sign in to access your dashboard
          </h2>
          <Link href="/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const name = user?.firstname + " " + user?.lastname;

  const favoritedProperties = favorites
    ? favorites.map((favorite: any) => favorite.property)
    : [];

  return (
    <>
      {/* Main Content */}
      {/* Stats cards */}
      {dashboardStats.length > 0 && (
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`h-8 w-8 ${stat.color}`}>{stat.icon}</div>
                  </div>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-500 mt-2">
                      {stat.subtitle}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="saved">Liked Properties</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="viewings">Viewings</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* <Card>
                <CardHeader>
                  <CardTitle>Recent Searches</CardTitle>
                  <CardDescription>
                    Your latest property searches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{search.query}</p>
                          <p className="text-sm text-gray-500">
                            {search.results} results • {search.date}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card> */}

              {/* <Card>
                <CardHeader>
                  <CardTitle>Recently Viewed Properties</CardTitle>
                  <CardDescription>
                    Properties you've looked at recently
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {recentlyViewed?.slice(0, 4).map((property: any) => (
                      <PropertyCard
                        key={property?.property?.id}
                        property={property?.property}
                        variant="compact"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card> */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Viewings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {viewings?.length == 0 && (
                      <div>You havent scheduled to view any properties....</div>
                    )}
                    {viewings?.map((viewing: any) => (
                      <div key={viewing.id} className="p-3 border rounded-lg">
                        <h4 className="font-medium">
                          {viewing?.property?.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(viewing?.scheduledAt).date} at{" "}
                          {formatDateTime(viewing?.scheduledAt).time}
                        </p>
                        <p className="text-sm text-gray-500">
                          with{" "}
                          {viewing?.property?.owner?.firstname +
                            " " +
                            viewing?.property?.owner?.lastname}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {viewing?.property?.address}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* <Card>
                <CardHeader>
                  <CardTitle>Upcoming Viewings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {viewings?.map((viewing: any) => (
                      <div key={viewing.id} className="p-3 border rounded-lg">
                        <h4 className="font-medium">
                          {viewing?.property?.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(viewing?.scheduledAt).date} at{" "}
                          {formatDateTime(viewing?.scheduledAt).time}
                        </p>
                        <p className="text-sm text-gray-500">
                          with{" "}
                          {viewing?.property?.owner?.firstname +
                            " " +
                            viewing?.property?.owner?.lastname}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {viewing?.property?.address}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card> */}

              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {messages?.slice(0, 3).map((message: any) => (
                      <div key={message.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {user?.id == message.owner?.id
                              ? `${message.user?.firstname}  ${message.user?.lastname}`
                              : `${message.owner?.firstname}  ${message.owner?.lastname}`}
                          </span>
                          {/* {message.unread && (
                            <Badge className="bg-blue-500 text-xs">New</Badge>
                          )} */}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          {message?.property?.title}
                        </p>
                        <p className="text-sm">
                          {message?.messages[0]?.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(
                            message?.messages[0]?.created_at
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Liked Properties ({stats?.favoritedProperties})
              </CardTitle>
              <CardDescription>
                Properties you've bookmarked for later
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritedProperties?.map((property: any) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isFavorite={true}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                Conversations with property owners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages?.map((message: any) => (
                  <div
                    key={message.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>
                        {user?.id == message.owner?.id
                          ? `${message.user?.firstname}  ${message.user?.lastname}`
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : `${message.owner?.firstname}  ${message.owner?.lastname}`
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">
                          {user?.id == message.owner?.id
                            ? `${message.user?.firstname}  ${message.user?.lastname}`
                            : `${message.owner?.firstname}  ${message.owner?.lastname}`}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(
                            message?.messages[0]?.created_at
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {message.property.title}
                      </p>
                      <p className="text-sm">{message?.messages[0]?.message}</p>
                    </div>
                    {message.unread && (
                      <Badge className="bg-blue-500">New</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viewings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Viewings</CardTitle>
              <CardDescription>Your upcoming property viewings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {viewings?.map((viewing: any) => (
                  <div key={viewing?.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">
                        {viewing?.property?.title}
                      </h4>
                      <Badge variant="outline">
                        {formatDateTime(viewing?.scheduledAt).time}
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">
                          Time: {formatDateTime(viewing?.scheduledAt).date}
                        </p>
                        <p className="text-gray-600">
                          Owner:{" "}
                          {viewing?.property?.owner?.firstname +
                            " " +
                            viewing?.property?.owner?.lastname}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {viewing?.property?.address}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm">Get Directions</Button>
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <Badge className="mt-1">
                      {user.isUserVerified
                        ? "Verified Account"
                        : "Unverified Account"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button className="w-full">Edit Profile</Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Email notifications</span>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Search alerts</span>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Privacy settings</span>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </TabsContent>
      </Tabs>
      <VerifyEmailDialog user={user} />
    </>
  );
}
