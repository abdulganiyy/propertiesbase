"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  MessageSquare,
  Calendar,
  BarChart3,
  Plus,
  Eye,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { LoadingDashboard } from "@/components/shared/loading-dashboard";
import { PropertyCard } from "@/components/shared/property-card";
import {
  useOwnerProperties,
  useOwnerViewings,
  useProperties,
} from "@/hooks/use-properties";
import { useUser, useUserStats } from "@/hooks/use-user";
import { PropertyFormDialog } from "@/app/dashboard/_components/property-form-dialog";
import Link from "next/link";
import { useSubmitProperty } from "@/hooks/use-properties";
import { DeletePropertyModal } from "../_components/delete-property-modal";
import { formatDateTime, getPriceDisplay } from "@/lib/utils";

export default function OwnerDashboard() {
  const { data: user, isLoading, error } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    mutateAsync,
    isPending,
    error: submitPropertyError,
  } = useSubmitProperty();

  // Mock data for owner's properties
  const { data: ownerProperties } = useOwnerProperties();

  const { data: ownerViewings } = useOwnerViewings();

  const { data: stats } = useUserStats();

  const ownerDashboardStats = [
    {
      title: "Total Properties",
      value: stats?.totalProperties,
      icon: <Building className="h-8 w-8" />,
      color: "text-blue-500",
      subtitle: `${stats?.totalProperties} active`,
    },
    // {
    //   title: "Monthly Revenue",
    //   value: `$${stats?.monthlyRevenue?.toLocaleString()}`,
    //   icon: <DollarSign className="h-8 w-8" />,
    //   color: "text-green-500",
    //   subtitle: "+12% from last month",
    // },
    // {
    //   title: "Total Inquiries",
    //   value: stats?.totalInquiries,
    //   icon: <MessageSquare className="h-8 w-8" />,
    //   color: "text-purple-500",
    //   subtitle: "8 new this week",
    // },
    {
      title: "Total Viewings Request",
      value: stats?.scheduledViewings,
      icon: <MessageSquare className="h-8 w-8" />,
      color: "text-purple-500",
      subtitle: "8 new this week",
    },

    {
      title: "Property Views",
      value: stats?.propertiesViews,
      icon: <Eye className="h-8 w-8" />,
      color: "text-orange-500",
      subtitle: "This month",
    },
  ];

  // const mockRecentInquiries = [
  //   {
  //     id: 1,
  //     property: "Modern Downtown Loft",
  //     inquirer: "Sarah Johnson",
  //     message: "I'm interested in scheduling a viewing for this weekend.",
  //     time: "2 hours ago",
  //     status: "new",
  //   },
  //   {
  //     id: 2,
  //     property: "Cozy Garden Apartment",
  //     inquirer: "Mike Chen",
  //     message: "Is this property still available? I'd like to apply.",
  //     time: "5 hours ago",
  //     status: "responded",
  //   },
  //   {
  //     id: 3,
  //     property: "Luxury Penthouse Suite",
  //     inquirer: "Anna Rodriguez",
  //     message: "What's included in the rent? Are utilities covered?",
  //     time: "1 day ago",
  //     status: "new",
  //   },
  // ];

  // const mockUpcomingViewings = [
  //   {
  //     id: 1,
  //     property: "Modern Downtown Loft",
  //     date: "Tomorrow",
  //     time: "2:00 PM",
  //     visitor: "Sarah Johnson",
  //     contact: "sarah.j@email.com",
  //   },
  //   {
  //     id: 2,
  //     property: "Cozy Garden Apartment",
  //     date: "Friday",
  //     time: "10:00 AM",
  //     visitor: "Mike Chen",
  //     contact: "mike.chen@email.com",
  //   },
  //   {
  //     id: 3,
  //     property: "Studio in Arts District",
  //     date: "Saturday",
  //     time: "3:00 PM",
  //     visitor: "Emma Wilson",
  //     contact: "emma.w@email.com",
  //   },
  // ];

  const mockAnalytics = {
    topPerformingProperty: "Modern Downtown Loft",
    averageViewsPerProperty: 43,
    inquiryToViewingRate: "68%",
    averageResponseTime: "2.5 hours",
  };

  const handlePropertySubmit = async (data: any) => {
    const { phoneNumber, email, availableDate, sqft, ...rest } = data;
    // console.log(data);
    await mutateAsync(rest);
  };

  if (isLoading) {
    return (
      <LoadingDashboard
        userRole="owner"
        title="Owner Dashboard"
        subtitle="Manage your properties and track performance"
      />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900">
            Something went wrong
          </h2>
          <p className="text-gray-600">{error.message}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

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

  const headerActions = (
    <div className="flex items-center gap-4">
      <PropertyFormDialog
        onSubmit={handlePropertySubmit}
        trigger={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        }
      />
      <Button variant="outline" asChild>
        <Link href="/messages">
          <MessageSquare className="h-4 w-4 mr-2" />
          Messages
        </Link>
      </Button>
    </div>
  );

  return (
    <>
      {ownerDashboardStats.length > 0 && (
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownerDashboardStats.map((stat, index) => (
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

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          {/* <TabsTrigger value="inquiries">Inquiries</TabsTrigger> */}
          <TabsTrigger value="viewings">Viewings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Property Performance</CardTitle>
                  <CardDescription>
                    Your top performing properties this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {ownerProperties?.properties.slice(0, 4).map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        variant="compact"
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-transparent"
                    asChild
                  >
                    <Link href="#properties">View All Properties</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>
                    Key metrics for your properties
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium">Top Performing Property</p>
                          <p className="text-sm text-gray-600">
                            {mockAnalytics.topPerformingProperty}
                          </p>
                        </div>
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium">Avg. Views per Property</p>
                          <p className="text-sm text-gray-600">
                            {mockAnalytics.averageViewsPerProperty} views
                          </p>
                        </div>
                        <Eye className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <p className="font-medium">Inquiry to Viewing Rate</p>
                          <p className="text-sm text-gray-600">
                            {mockAnalytics.inquiryToViewingRate}
                          </p>
                        </div>
                        <BarChart3 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <p className="font-medium">Avg. Response Time</p>
                          <p className="text-sm text-gray-600">
                            {mockAnalytics.averageResponseTime}
                          </p>
                        </div>
                        <MessageSquare className="h-5 w-5 text-orange-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* <Card>
                <CardHeader>
                  <CardTitle>Recent Inquiries</CardTitle>
                  <CardDescription>
                    Latest messages from potential tenants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockRecentInquiries.slice(0, 3).map((inquiry) => (
                      <div key={inquiry.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {inquiry.inquirer}
                          </span>
                          <Badge
                            variant={
                              inquiry.status === "new" ? "default" : "secondary"
                            }
                          >
                            {inquiry.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          {inquiry.property}
                        </p>
                        <p className="text-sm">{inquiry.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {inquiry.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-transparent"
                    asChild
                  >
                    <Link href="#inquiries">View All Inquiries</Link>
                  </Button>
                </CardContent>
              </Card> */}

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Viewings</CardTitle>
                  <CardDescription>Scheduled property viewings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ownerViewings?.slice(0, 3).map((viewing: any) => (
                      <div key={viewing.id} className="p-3 border rounded-lg">
                        <h4 className="font-medium text-sm">
                          {viewing?.property?.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(viewing?.scheduledAt).date}
                          {" at "} {formatDateTime(viewing?.scheduledAt).time}
                        </p>
                        <p className="text-sm text-gray-500">
                          with {viewing?.user?.firstname}{" "}
                          {viewing?.user?.lastname}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {viewing?.user?.email}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-transparent"
                    asChild
                  >
                    <Link href="#viewings">Manage Viewings</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <PropertyFormDialog
                    onSubmit={handlePropertySubmit}
                    trigger={
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Property
                      </Button>
                    }
                  />
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    asChild
                  >
                    <Link href="/chat">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View Messages
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    asChild
                  >
                    <Link href="#analytics">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Your Properties ({stats?.totalProperties})
              </h2>
              <p className="text-gray-600">
                {stats?.activeListings} active listings
              </p>
            </div>
            <PropertyFormDialog
              onSubmit={handlePropertySubmit}
              isPending={isPending}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              }
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownerProperties?.properties.map((property) => (
              <div key={property.id} className="relative">
                <PropertyCard property={property} />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button size="sm" variant="outline" className="bg-white/90">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <PropertyFormDialog
                    onSubmit={handlePropertySubmit}
                    property={property as any}
                    isPending={isPending}
                    isEditing
                    trigger={
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/90"
                      >
                        Edit
                      </Button>
                    }
                  />
                  <DeletePropertyModal propertyId={property.id as string} />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        {/* 
        <TabsContent value="inquiries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Property Inquiries ({mockRecentInquiries.length})
              </CardTitle>
              <CardDescription>Messages from potential tenants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{inquiry.inquirer}</h4>
                        <p className="text-sm text-gray-600">
                          {inquiry.property}
                        </p>
                      </div>
                      <Badge
                        variant={
                          inquiry.status === "new" ? "default" : "secondary"
                        }
                      >
                        {inquiry.status}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3">{inquiry.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {inquiry.time}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Reply
                        </Button>
                        <Button size="sm">Schedule Viewing</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="viewings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Scheduled Viewings ({ownerViewings?.length})
              </CardTitle>
              <CardDescription>Upcoming property viewings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ownerViewings?.map((viewing: any) => (
                  <div key={viewing.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">
                          {viewing?.property?.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(viewing?.scheduledAt).date} at{" "}
                          {formatDateTime(viewing?.scheduledAt).time}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {formatDateTime(viewing?.scheduledAt).date}
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-600">
                          Visitor: {viewing?.user?.firstname}{" "}
                          {viewing?.user?.lastname}
                        </p>
                        <p className="text-gray-600">
                          Contact Email: {viewing?.user?.email}
                        </p>
                        <p className="text-gray-600">
                          Contact Phone: {viewing?.user?.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Contact Visitor
                      </Button>
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 bg-transparent"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators for your properties
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Total Views</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats?.propertiesViews}
                    </p>
                    <p className="text-sm text-gray-600">This month</p>
                  </div>
                  {/* <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Inquiries</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {stats?.totalInquiries}
                    </p>
                    <p className="text-sm text-gray-600">Total received</p>
                  </div> */}
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Viewings</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {stats?.scheduledViewings}
                    </p>
                    <p className="text-sm text-gray-600">Scheduled</p>
                  </div>
                  {/* <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-orange-500" />
                      <span className="font-medium">Revenue</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">
                      ${stats?.monthlyRevenue?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">This month</p>
                  </div> */}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Rankings</CardTitle>
                <CardDescription>
                  Your properties ranked by performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ownerProperties?.properties
                    .slice(0, 5)
                    .map((property: any, index) => (
                      <div
                        key={property.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                            <span className="text-sm font-bold text-blue-600">
                              #{index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{property.title}</p>
                            <p className="text-sm text-gray-500">
                              {property?.views?.length} views
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {getPriceDisplay(property).price}
                          </p>
                          {/* <p className="text-sm text-gray-500">
                            {Math.floor(Math.random() * 10) + 1} inquiries
                          </p> */}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
