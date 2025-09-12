"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Building,
  AlertTriangle,
  BarChart3,
  Shield,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { LoadingDashboard } from "@/components/shared/loading-dashboard";
import { useAllUsers, useRecentActivities, useUser } from "@/hooks/use-user";
import Link from "next/link";
import { useUserStats } from "@/hooks/use-user";
import { useSearchParams } from "next/navigation";
import { formatDateTime, timeAgo } from "@/lib/utils";
import { useAllProperties, useProperties } from "@/hooks/use-properties";
import { EditPropertyModal } from "../_components/admin-edit-property-modal";
import { DeletePropertyModal } from "../_components/delete-property-modal";

const getPriceDisplay = (property: any) => {
  switch (property?.listingType) {
    case "sale":
      return {
        price: `${property?.currency || "₦"}${property?.salePrice?.toLocaleString() || property?.price?.toLocaleString()}`,
        period: "",
        subtitle: "Sale Price",
      };
    case "rent":
      if (property?.rentPeriod === "yearly" && property?.yearlyRent) {
        return {
          price: `${property?.currency || "₦"}${property?.yearlyRent?.toLocaleString()}`,
          period: "/year",
          subtitle: "Annual Rent",
        };
      }
      return {
        price: `${property?.currency || "₦"}${property?.monthlyRent?.toLocaleString() || property?.price?.toLocaleString()}`,
        period: "/month",
        subtitle: "Monthly Rent",
      };
    case "lease":
      return {
        price: `${property?.currency || "₦"}${property?.leaseAmount?.toLocaleString() || property?.price?.toLocaleString()}`,
        period: property?.leaseDuration ? `/${property?.leaseDuration}` : "",
        subtitle: "Lease Amount",
      };
    default:
      return {
        price: `${property?.currency || "₦"}${property?.price?.toLocaleString() || "300"}`,
        // price: `$333`,

        period: "/month",
        subtitle: "Price",
      };
  }
};

export default function AdminDashboard() {
  const { data: user, isLoading, error } = useUser();

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

  const { data: stats } = useUserStats();

  const { data: activity } = useRecentActivities();

  const { data: users } = useAllUsers();

  const { data: properties } = useAllProperties();

  const adminDashboardStats = [
    {
      title: "Total Users",
      value: stats?.totalUsers?.toLocaleString(),
      icon: <Users className="h-8 w-8" />,
      color: "text-blue-500",
      // subtitle: `+${stats.newUsersThisMonth} this month`,
    },
    {
      title: "Total Properties",
      value: stats?.totalProperties?.toLocaleString(),
      icon: <Building className="h-8 w-8" />,
      color: "text-green-500",
      // subtitle: `${stats.pendingApprovals} pending approval`,
    },
    // {
    //   title: "Active Reports",
    //   value: mockStats.activeReports,
    //   icon: <AlertTriangle className="h-8 w-8" />,
    //   color: "text-red-500",
    //   subtitle: "Requires attention",
    // },
    // {
    //   title: "Monthly Revenue",
    //   value: `$${mockStats.monthlyRevenue.toLocaleString()}`,
    //   icon: <BarChart3 className="h-8 w-8" />,
    //   color: "text-purple-500",
    //   subtitle: "+18% from last month",
    // },
  ];

  // const mockReports = [
  //   {
  //     id: 1,
  //     type: "Property Issue",
  //     reporter: "Sarah Johnson",
  //     subject: "Modern Downtown Loft",
  //     description: "Property photos don't match actual condition",
  //     status: "open",
  //     priority: "high",
  //     dateReported: "2024-01-20",
  //   },
  //   {
  //     id: 2,
  //     type: "User Behavior",
  //     reporter: "Mike Chen",
  //     subject: "Spam Messages",
  //     description: "User sending inappropriate messages to property owners",
  //     status: "investigating",
  //     priority: "medium",
  //     dateReported: "2024-01-19",
  //   },
  //   {
  //     id: 3,
  //     type: "Payment Issue",
  //     reporter: "Anna Rodriguez",
  //     subject: "Failed Transaction",
  //     description: "Application fee payment failed but was charged",
  //     status: "resolved",
  //     priority: "low",
  //     dateReported: "2024-01-18",
  //   },
  // ];

  if (isLoading) {
    return (
      <LoadingDashboard
        userRole="admin"
        title="Admin Dashboard"
        subtitle="Manage users, properties, and platform operations"
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
            Please sign in to access the admin dashboard
          </h2>
          <Link href="/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the admin dashboard.
          </p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const headerActions = (
    <div className="flex items-center gap-4">
      <Button variant="outline">
        <Shield className="h-4 w-4 mr-2" />
        System Settings
      </Button>
      <Button variant="outline">
        <BarChart3 className="h-4 w-4 mr-2" />
        Reports
      </Button>
    </div>
  );

  return (
    <>
      {adminDashboardStats.length > 0 && (
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {adminDashboardStats.map((stat, index) => (
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
                  {/* {stat.subtitle && (
                    <p className="text-xs text-gray-500 mt-2">
                      {stat.subtitle}
                    </p>
                  )} */}
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          {/* <TabsTrigger value="reports">Reports</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                  <CardDescription>
                    Recent activity across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-medium">New user registration</p>
                        <p className="text-sm text-gray-500">
                          {/* Sarah Johnson joined as a renter */}
                          {`${activity?.user?.firstname} ${activity?.user?.lastname}`}{" "}
                          joined as a {activity?.user?.role}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {timeAgo(activity?.user?.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                      <Building className="h-5 w-5 text-green-500" />
                      <div className="flex-1">
                        <p className="font-medium">Property listed</p>
                        <p className="text-sm text-gray-500">
                          {/* Mike Chen added "Modern Downtown Loft" */}
                          {`${activity?.property?.owner?.firstname} ${activity?.property?.owner?.lastname}`}{" "}
                          added {`"${activity?.property?.title}"`}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {timeAgo(activity?.property?.created_at)}
                      </span>
                    </div>
                    {/* <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div className="flex-1">
                        <p className="font-medium">Report submitted</p>
                        <p className="text-sm text-gray-500">
                          Property issue reported by user
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div> */}
                  </div>
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>
                    Platform performance and status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium">Server Status</p>
                          <p className="text-sm text-gray-600">
                            All systems operational
                          </p>
                        </div>
                        <Badge className="bg-green-500">Online</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium">Database</p>
                          <p className="text-sm text-gray-600">
                            Response time: 45ms
                          </p>
                        </div>
                        <Badge className="bg-blue-500">Healthy</Badge>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <p className="font-medium">API Status</p>
                          <p className="text-sm text-gray-600">99.9% uptime</p>
                        </div>
                        <Badge className="bg-purple-500">Stable</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <p className="font-medium">Storage</p>
                          <p className="text-sm text-gray-600">
                            78% capacity used
                          </p>
                        </div>
                        <Badge className="bg-orange-500">Normal</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Actions</CardTitle>
                  <CardDescription>
                    Items requiring admin attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          Property Approvals
                        </span>
                        <Badge>{activity?.pendingProperties || 0}</Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        Properties waiting for approval
                      </p>
                    </div>
                    {/* <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          User Reports
                        </span>
                        <Badge variant="destructive">
                          {stats?.activeReports || 0}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        Active reports to review
                      </p>
                    </div> */}
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          Account Verifications
                        </span>
                        <Badge variant="secondary">
                          {activity?.pendingUsers}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        Accounts pending verification
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Building className="h-4 w-4 mr-2" />
                    Review Properties
                  </Button>
                  {/* <Button variant="outline" className="w-full bg-transparent">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Handle Reports
                  </Button> */}
                  {/* <Button variant="outline" className="w-full bg-transparent">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button> */}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">User Management</h2>
              <p className="text-gray-600">
                Manage platform users and their permissions
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search users..." className="pl-10 w-64" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="renter">Renters</SelectItem>
                  <SelectItem value="owner">Owners</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4 font-medium">User</th>
                      <th className="text-left p-4 font-medium">Role</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Properties</th>
                      <th className="text-left p-4 font-medium">Join Date</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.map((user: any) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">
                              {user?.firstname + " " + user?.lastname}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user?.email}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="capitalize">
                            {user?.role}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              user?.isUserVerified || user?.isOwnerVerified
                                ? "default"
                                : "secondary"
                            }
                            //   variant={
                            //   user?.isUserVerified || user?.isOwnerVerified
                            //     ? "default"
                            //     : user.status === "suspended"
                            //       ? "destructive"
                            //       : "secondary"
                            // }
                          >
                            {user?.isUserVerified || user?.isOwnerVerified
                              ? "Verified"
                              : "Unverified"}
                          </Badge>
                        </td>
                        <td className="p-4">{user?._count?.properties}</td>
                        <td className="p-4">
                          {formatDateTime(user?.created_at).date}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Property Management</h2>
              <p className="text-gray-600">
                Review and manage property listings
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4 font-medium">Property</th>
                      <th className="text-left p-4 font-medium">Owner</th>
                      <th className="text-left p-4 font-medium">Price</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Views</th>
                      {/* <th className="text-left p-4 font-medium">Inquiries</th> */}
                      <th className="text-left p-4 font-medium">Date Added</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties?.properties?.length != 0 &&
                      properties?.properties?.map((property: any) => (
                        <tr
                          key={property.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-4">
                            <p className="font-medium">{property.title}</p>
                          </td>
                          <td className="p-4">
                            {property.owner?.firstname +
                              " " +
                              property.owner?.lastname}
                          </td>
                          <td className="p-4">
                            {getPriceDisplay(property).price}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={
                                property.status === "AVAILABLE"
                                  ? "default"
                                  : property.status === "PENDING"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {property.status}
                            </Badge>
                          </td>
                          <td className="p-4">{property?.views?.length}</td>
                          {/* <td className="p-4">{property.inquiries}</td> */}
                          <td className="p-4">
                            {formatDateTime(property?.created_at).date}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {/* <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button> */}
                              <EditPropertyModal property={property} />
                              <DeletePropertyModal propertyId={property?.id} />
                              {/* <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 bg-transparent"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button> */}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Reports & Issues</h2>
              <p className="text-gray-600">
                Handle user reports and platform issues
              </p>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {/* {mockReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{report.type}</Badge>
                      <Badge
                        variant={
                          report.priority === "high"
                            ? "destructive"
                            : report.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {report.priority} priority
                      </Badge>
                    </div>
                    <Badge
                      variant={
                        report.status === "open"
                          ? "destructive"
                          : report.status === "investigating"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {report.status}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold mb-1">{report.subject}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Reported by: {report.reporter}
                      </p>
                      <p className="text-sm">{report.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Reported: {report.dateReported}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Contact Reporter
                    </Button>
                    {report.status === "open" && (
                      <Button size="sm">Start Investigation</Button>
                    )}
                    {report.status === "investigating" && (
                      <Button size="sm">Mark Resolved</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))} */}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
