"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Home,
  MapPin,
  Star,
  Bed,
  Bath,
  Square,
  Heart,
  MessageCircle,
  Phone,
  Share2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Car,
  PawPrint,
  Dumbbell,
  Waves,
  Shield,
  Clock,
  CheckCircle,
  Play,
  Map,
  Navigation,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useProperty,
  useSubmitInquiry,
  useToggleFavorite,
  useTrackViewMutation,
} from "@/hooks/use-properties";
import type { InquiryData } from "@/lib/api";
import { useParams } from "next/navigation";
import { PropertyShare } from "@/components/shared/property-share";
import { ScheduleViewingModal } from "@/components/shared/schedule-property-view";
import { useStartChat } from "@/hooks/use-chat";

import { useUser } from "@/hooks/use-user";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  pets: PawPrint,
  gym: Dumbbell,
  pool: Waves,
  security: Shield,
  concierge: Clock,
  terrace: Home,
};

interface PropertyDetailPageProps {
  params: {
    id: string;
  };
}

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

function formatLocation({
  address,
  city,
  state,
  country,
}: {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}) {
  // Filter out falsy parts and join them
  return [address, city, state, country].filter(Boolean).join(", ");
}

export default function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  // const propertyId = params.id;
  const { id: propertyId } = useParams();
  console.log(propertyId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    moveInDate: "",
  });

  const { mutate } = useTrackViewMutation(propertyId as string);

  useEffect(() => {
    // Fire once when component mounts
    mutate();
  }, [mutate]);

  // Fetch property data
  const {
    data: property,
    isLoading,
    error,
  } = useProperty(propertyId as string);
  const submitInquiryMutation = useSubmitInquiry();
  const toggleFavoriteMutation = useToggleFavorite();
  const priceInfo = getPriceDisplay(property);

  const { data: user } = useUser();
  // const { mutateAsync, isPending } = useToggleFavorite();
  const { mutateAsync: startChat, isPending: isStartChatPending } =
    useStartChat();

  const router = useRouter();

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + property.images.length) % property.images.length
      );
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    const inquiryData: InquiryData = {
      propertyId: property.id,
      ...inquiryForm,
    };

    submitInquiryMutation.mutate(inquiryData, {
      onSuccess: (response) => {
        // Reset form on success
        setInquiryForm({
          name: "",
          email: "",
          phone: "",
          message: "",
          moveInDate: "",
        });
      },
    });
  };

  const handleToggleFavorite = () => {
    if (!property) return;

    if (user && user.role != "user") return;

    // Optimistic update
    setIsFavorite(!isFavorite);

    toggleFavoriteMutation.mutate(property.id, {
      onError: () => {
        // Revert on error
        setIsFavorite(isFavorite);
      },
    });
  };

  const handleStartChat = async (e: React.MouseEvent) => {
    if (user.role != "user") return;
    try {
      // console.log(property.id, user.id);
      const chat = await startChat({
        propertyId: property.id,
        userId: user.id,
      });

      router.push(`/chat/${chat.id}`);
    } catch (error) {
      toast.error("Unable to start chat now");
    }

    // onFavoriteToggle?.(property.id);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/listings" className="flex items-center gap-2">
                <ChevronLeft className="h-5 w-5" />
                <Home className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">PropertiesBase</span>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          <Skeleton className="h-96 w-full mb-8" />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="text-center">
                        <Skeleton className="h-8 w-8 mx-auto mb-2" />
                        <Skeleton className="h-4 w-12 mx-auto mb-1" />
                        <Skeleton className="h-3 w-16 mx-auto" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-24 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/listings" className="flex items-center gap-2">
                <ChevronLeft className="h-5 w-5" />
                <Home className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">PropertiesBase</span>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load property details. The property may not exist or
              there was a network error.
              <Link href="/listings">
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 bg-transparent"
                >
                  Back to Listings
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/listings" className="flex items-center gap-2">
              <ChevronLeft className="h-5 w-5" />
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">PropertiesBase</span>
            </Link>
            <div className="flex items-center gap-2">
              <PropertyShare property={property} />
              {/* <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button> */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                disabled={toggleFavoriteMutation.isPending}
              >
                {toggleFavoriteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Heart
                    className={`h-4 w-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                  />
                )}
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Property Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{property.rating || 5}</span>
                  <span>({property.reviews || 40} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {formatLocation({
                      address: property.address,
                      city: property.city,
                      state: property.state,
                      country: property.country || "Nigeria",
                    })}
                  </span>
                </div>
                <Badge className="bg-green-500">Direct Owner</Badge>
              </div>
            </div>
            <div className="text-right">
              {/* <div className="text-3xl font-bold">${property.price}</div>
              <div className="text-gray-500">per month</div> */}
              <span className="text-3xl font-bold">{priceInfo.price}</span>
              <span className="text-gray-500">{priceInfo.period}</span>
              <div className="text-sm text-gray-500">{priceInfo.subtitle}</div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2 h-96">
            <div className="col-span-2 relative">
              <Image
                src={
                  property.images[currentImageIndex].imageUrl ||
                  "/placeholder.svg"
                }
                alt="Main property image"
                fill
                className="object-cover rounded-l-lg cursor-pointer"
                onClick={() => setShowAllImages(true)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-2">
              {property.images.slice(1, 5).map((image: any, index: number) => (
                <div key={index} className="relative">
                  <Image
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={`Property image ${index + 2}`}
                    fill
                    className={`object-cover cursor-pointer ${
                      index === 3 ? "rounded-tr-lg" : ""
                    } ${index === 1 ? "rounded-br-lg" : ""}`}
                    onClick={() => setShowAllImages(true)}
                  />
                  {index === 3 && property.images.length > 5 && (
                    <div
                      className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold cursor-pointer rounded-tr-lg"
                      onClick={() => setShowAllImages(true)}
                    >
                      +{property.images.length - 5} more
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => setShowAllImages(true)}>
              View All {property.images.length} Photos
            </Button>
            {/* <Button variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Virtual Tour
            </Button> */}
            {/* <Button variant="outline">
              <Map className="h-4 w-4 mr-2" />
              Floor Plan
            </Button> */}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <Bed className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-gray-500">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <Bath className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div className="text-sm text-gray-500">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <Square className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{property.sqft || 400}</div>
                    <div className="text-sm text-gray-500">Sq Ft</div>
                  </div>
                  <div className="text-center">
                    <Home className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{property.propertyType}</div>
                    <div className="text-sm text-gray-500">Type</div>
                  </div>
                </div>
                <Separator className="my-6" />
                <div>
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.amenities.map((amenity: any, index: number) => {
                    const Icon =
                      amenityIcons[amenity.icon as keyof typeof amenityIcons] ||
                      CheckCircle;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-green-500" />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            {property.propertyReviews &&
              property.propertyReviews.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      {property.rating} •{" "}
                      {property.propertyReviews.length || 40} Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {property.propertyReviews.map((review: any) => (
                        <div key={review.id} className="flex gap-4">
                          <Avatar>
                            <AvatarImage
                              src={review.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {review.author
                                .split(" ")
                                .map((n: any) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                {review.author}
                              </span>
                              <div className="flex">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {review.date}
                              </span>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle>Property Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={property.owner.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {property.owner.firstname
                        .split(" ")
                        .map((n: any) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">
                        {property.owner.name}
                      </h3>
                      {property.owner.verified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {property.owner.rating || 50}
                      </span>
                      <span className="text-gray-500">
                        ({property.owner.reviewCount || 40} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response rate:</span>
                    <span className="font-medium">
                      {property.owner.responseRate || "90%"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response time:</span>
                    <span className="font-medium">
                      {property.owner.responseTime || "1hr"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Joined:</span>
                    <span className="font-medium">
                      {property.owner.joinedDate || "July 28, 2024"}
                    </span>
                  </div>
                </div>
                {property.owner.bio && (
                  <p className="text-gray-600 text-sm mb-4">
                    {property.owner.bio}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleStartChat}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Send Inquiry</CardTitle>
                <CardDescription>
                  Get in touch with the property owner directly
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitInquiryMutation.isSuccess && (
                  <Alert className="mb-4">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      {submitInquiryMutation.data?.message}
                    </AlertDescription>
                  </Alert>
                )}
                {submitInquiryMutation.isError && (
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {submitInquiryMutation.error?.message ||
                        "Failed to send inquiry. Please try again."}
                    </AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={inquiryForm.name}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={inquiryForm.email}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={inquiryForm.phone}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      placeholder="Preferred Move-in Date"
                      value={inquiryForm.moveInDate}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          moveInDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Message (optional)"
                      value={inquiryForm.message}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          message: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitInquiryMutation.isPending}
                  >
                    {submitInquiryMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Inquiry"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card> */}

            {/* Quick Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <ScheduleViewingModal propertyId={property.id} />
                  {/* <Button variant="outline" className="w-full bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Viewing
                  </Button> */}
                  {/* <Button variant="outline" className="w-full bg-transparent">
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button> */}
                  <PropertyShare
                    property={property}
                    trigger={
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Property
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <Dialog open={showAllImages} onOpenChange={setShowAllImages}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Property Photos</DialogTitle>
            <DialogDescription>
              {currentImageIndex + 1} of {property.images.length}
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <Image
              src={
                property.images[currentImageIndex].imageUrl ||
                "/placeholder.svg"
              }
              alt={`Property image ${currentImageIndex + 1}`}
              width={800}
              height={600}
              className="w-full h-auto max-h-[60vh] object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
            {property.images.map((image: any, index: number) => (
              <Image
                key={index}
                src={image.imageUrl || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                width={100}
                height={75}
                className={`aspect-[4/3] object-cover cursor-pointer rounded ${
                  index === currentImageIndex ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
