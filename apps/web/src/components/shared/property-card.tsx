"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  MessageCircle,
  Phone,
  Wifi,
  Car,
  PawPrint,
  Dumbbell,
  Waves,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/api";
import { useToggleFavorite } from "@/hooks/use-properties";
import { useStartChat } from "@/hooks/use-chat";
import { useUser } from "@/hooks/use-user";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

interface PropertyCardProps {
  property: Property | any;
  onFavoriteToggle?: (propertyId: string) => void;
  onPrefetch?: (propertyId: number) => void;
  isFavorite?: boolean;
  isToggling?: boolean;
  variant?: "default" | "compact" | "featured";
}

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  pets: PawPrint,
  gym: Dumbbell,
  pool: Waves,
};

const getListingTypeBadge = (listingType: string) => {
  const badges = {
    sale: { label: "For Sale", className: "bg-green-500" },
    rent: { label: "For Rent", className: "bg-blue-500" },
    lease: { label: "For Lease", className: "bg-purple-500" },
  };
  return badges[listingType as keyof typeof badges] || badges.rent;
};

const getPriceDisplay = (property: Property | any) => {
  switch (property.listingType) {
    case "sale":
      return {
        price: `${property.currency || "₦"}${property.salePrice?.toLocaleString() || property.price.toLocaleString()}`,
        period: "",
        subtitle: "Sale Price",
      };
    case "rent":
      if (property.rentPeriod === "yearly" && property.yearlyRent) {
        return {
          price: `${property.currency || "₦"}${property.yearlyRent.toLocaleString()}`,
          period: "/year",
          subtitle: "Annual Rent",
        };
      }
      return {
        price: `${property.currency || "₦"}${property.monthlyRent?.toLocaleString() || property.price.toLocaleString()}`,
        period: "/month",
        subtitle: "Monthly Rent",
      };
    case "lease":
      return {
        price: `${property.currency || "₦"}${property.leaseAmount?.toLocaleString() || property.price.toLocaleString()}`,
        period: property.leaseDuration ? `/${property.leaseDuration}` : "",
        subtitle: "Lease Amount",
      };
    default:
      return {
        price: `${property.currency || "₦"}${property.price?.toLocaleString() || "300"}`,
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

export function PropertyCard({
  property,
  onFavoriteToggle,
  onPrefetch,
  isFavorite = false,
  isToggling = false,
  variant = "default",
}: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);
  const listingBadge = getListingTypeBadge(property.listingType || "rent");
  const priceInfo = getPriceDisplay(property);
  const { data: user } = useUser();
  const { mutateAsync, isPending } = useToggleFavorite();
  const { mutateAsync: startChat, isPending: isStartChatPending } =
    useStartChat();

  const router = useRouter();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    if (!user) return;
    if (user?.id == property?.owner?.id) return;
    e.preventDefault();
    e.stopPropagation();

    await mutateAsync(property.id);
  };

  const handleMouseEnter = () => {
    onPrefetch?.(property.id);
  };

  const handleStartChat = async (e: React.MouseEvent) => {
    if (!user) {
      router.push("/signin");
      return;
    }
    if (user?.id == property?.owner?.id) {
      toast("Please signin as a user to message property owner");
      return;
    }

    // only renter or buyer should be able to message property owner
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

  if (variant === "compact") {
    return (
      <Card
        className="overflow-hidden hover:shadow-md transition-shadow"
        onMouseEnter={handleMouseEnter}
      >
        <div className="flex">
          <div className="relative w-32 h-24 flex-shrink-0">
            <Link href={`/listings/${property.id}`}>
              <Image
                alt={property.title}
                className="object-cover w-full h-full cursor-pointer"
                fill
                src={
                  imageError
                    ? "/placeholder.svg"
                    : property.images[0].imageUrl || "/placeholder.svg"
                }
                onError={() => setImageError(true)}
              />
            </Link>
            <div className="absolute top-1 left-1 flex gap-1">
              <Badge className={`text-xs ${listingBadge.className}`}>
                {listingBadge.label}
              </Badge>
              {property.featured && (
                <Badge className="text-xs bg-yellow-500">Featured</Badge>
              )}
            </div>
          </div>
          <CardContent className="flex-1 p-3">
            <div className="flex justify-between items-start mb-1">
              <Link href={`/listings/${property.id}`}>
                <h3 className="font-medium text-sm hover:text-primary cursor-pointer line-clamp-1">
                  {property.title}
                </h3>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-2"
                onClick={handleFavoriteClick}
                disabled={isPending}
              >
                {isToggling ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Heart
                    className={`h-3 w-3 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                  />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-1 text-gray-500 mb-2">
              <MapPin className="h-3 w-3" />
              <span className="text-xs line-clamp-1">{property.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm">{priceInfo.price}</span>
                <span className="text-xs text-gray-500">
                  {priceInfo.period}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{property.rating || "3"}</span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card
        className="overflow-hidden hover:shadow-xl transition-all duration-300"
        onMouseEnter={handleMouseEnter}
      >
        <div className="relative">
          <Link href={`/listings/${property.id}`}>
            <Image
              alt={property.title}
              className="aspect-[4/3] object-cover w-full cursor-pointer"
              height="400"
              src={
                imageError
                  ? "/placeholder.svg"
                  : property.images[0].imageUrl || "/placeholder.svg"
              }
              width="600"
              onError={() => setImageError(true)}
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white shadow-sm"
            onClick={handleFavoriteClick}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart
                className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
              />
            )}
          </Button>
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={`text-xs ${listingBadge.className}`}>
              {listingBadge.label}
            </Badge>
            {property.isDirectOwner && (
              <Badge className="bg-green-600 text-xs">Direct Owner</Badge>
            )}
            {property.featured && (
              <Badge className="bg-yellow-500 text-xs">Featured</Badge>
            )}
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <Link href={`/listings/${property.id}`}>
              <h3 className="font-bold text-xl hover:text-primary cursor-pointer line-clamp-2">
                {property.title}
              </h3>
            </Link>
            <div className="flex items-center gap-1 ml-4">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{property.rating || 4}</span>
              <span className="text-gray-500 text-sm">
                ({property.reviews || 30})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-500 mb-4">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {/* {property.location} */}
              {formatLocation({
                address: property.address,
                city: property.city,
                state: property.state,
                country: property.country || "Nigeria",
              })}
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>
                {property.bedrooms === 0
                  ? "Studio"
                  : `${property.bedrooms} bed`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms} bath</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.sqft} sqft</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            {property.amenities.slice(0, 4).map((amenity: any) => {
              const Icon =
                amenityIcons[amenity.icon as keyof typeof amenityIcons];
              return Icon ? (
                <Icon key={amenity.icon} className="h-4 w-4 text-gray-500" />
              ) : null;
            })}
            {property.amenities.length > 4 && (
              <span className="text-xs text-gray-500">
                +{property.amenities.length - 4} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-3xl font-bold">{priceInfo.price}</span>
              <span className="text-gray-500">{priceInfo.period}</span>
              <div className="text-sm text-gray-500">{priceInfo.subtitle}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                {property.owner.firstname}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-500">
                  {property.owner.rating || 4} owner rating
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleStartChat}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Message Owner
            </Button>
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow"
      onMouseEnter={handleMouseEnter}
    >
      <div className="relative">
        <Link href={`/listings/${property?.id}`}>
          <Image
            alt={property?.title}
            className="aspect-[4/3] object-cover w-full cursor-pointer"
            height="300"
            src={
              imageError
                ? "/placeholder.svg"
                : property?.images && property.images.length > 0
                  ? property.images[0].imageUrl
                  : "/placeholder.svg"
            }
            width="400"
            onError={() => setImageError(true)}
          />
        </Link>
        {user?.id == property?.owner?.id ? null : (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={handleFavoriteClick}
            disabled={isPending}
          >
            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart
                className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
              />
            )}
          </Button>
        )}
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className={`text-xs ${listingBadge.className}`}>
            {listingBadge.label}
          </Badge>
          <Badge className="bg-green-600 text-xs">Direct Owner</Badge>
          {/* {property.isDirectOwner && (
            <Badge className="bg-green-600 text-xs">Direct Owner</Badge>
          )} */}
          {property.featured && (
            <Badge className="bg-yellow-500 text-xs">Featured</Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Link href={`/listings/${property.id}`}>
            <h3 className="font-semibold text-lg hover:text-primary cursor-pointer line-clamp-2">
              {property.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 ml-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{property.rating || 4}</span>
            <span className="text-sm text-gray-500">
              ({property.reviews || 20})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-500 mb-3">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">
            {formatLocation({
              address: property.address,
              city: property.city,
              state: property.state,
              country: property.country || "Nigeria",
            })}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>
              {property.bedrooms == 0
                ? "Studio"
                : `${property?.bedrooms || ""} bed`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{property.sqft || 100} sqft</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {property.amenities.slice(0, 3).map((amenity: any) => {
            const Icon =
              amenityIcons[amenity.icon as keyof typeof amenityIcons];
            return Icon ? (
              <Icon key={amenity.icon} className="h-4 w-4 text-gray-500" />
            ) : null;
          })}
          {property.amenities.length > 3 && (
            <span className="text-xs text-gray-500">
              +{property.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold">{priceInfo.price}</span>
            <span className="text-gray-500">{priceInfo.period}</span>
            <div className="text-xs text-gray-500">{priceInfo.subtitle}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              {property.owner?.firstname}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-500">
                {property.owner?.rating || 40} owner rating
              </span>
            </div>
          </div>
        </div>

        {user?.id == property?.owner?.id ? null : (
          <div className="flex gap-2">
            <Button className="flex-1" size="sm" onClick={handleStartChat}>
              <MessageCircle className="h-4 w-4 mr-2" />
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Message Owner"
              )}
            </Button>
            {/* <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button> */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
