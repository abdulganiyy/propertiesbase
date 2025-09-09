"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Wifi,
  Car,
  PawPrint,
  Dumbbell,
  Waves,
  X,
  MapPin,
  DollarSign,
  Home,
  Building,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  filters: {
    priceRange: number[];
    bedrooms: string;
    amenities: string[];
    propertyType: string;
    location: string;
    listingType?: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  className?: string;
}

const amenityOptions = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "pets", label: "Pet Friendly", icon: PawPrint },
  { id: "gym", label: "Gym/Fitness", icon: Dumbbell },
  { id: "pool", label: "Pool", icon: Waves },
];

const propertyTypes = [
  { value: "any", label: "Any Type" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "studio", label: "Studio" },
];

const listingTypes = [
  { value: "any", label: "All Listings", icon: Home },
  { value: "rent", label: "For Rent", icon: Building },
  { value: "sale", label: "For Sale", icon: DollarSign },
  { value: "lease", label: "For Lease", icon: Calendar },
];

export function SearchFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  className,
}: SearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleAmenity = (amenityId: string) => {
    const currentAmenities = localFilters.amenities || [];
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter((id) => id !== amenityId)
      : [...currentAmenities, amenityId];
    updateFilter("amenities", newAmenities);
  };

  const hasActiveFilters = () => {
    return (
      localFilters.location ||
      localFilters.bedrooms !== "any" ||
      localFilters.propertyType !== "any" ||
      localFilters.listingType !== "any" ||
      localFilters.priceRange[0] > 0 ||
      localFilters.priceRange[1] < 5000000000 ||
      (localFilters.amenities && localFilters.amenities.length > 0)
    );
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLocalFilters({
                  priceRange: [0, 5000],
                  bedrooms: "any",
                  amenities: [],
                  propertyType: "any",
                  location: "",
                  listingType: "any",
                });
                onClearFilters();
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Search */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Enter city, neighborhood..."
              value={localFilters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Listing Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Listing Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {listingTypes.map((type) => {
              const Icon = type.icon;
              const isSelected =
                (localFilters.listingType || "any") === type.value;
              return (
                <Button
                  key={type.value}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter("listingType", type.value)}
                  className="justify-start"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {type.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Price Range
            {localFilters.listingType === "sale" && " (Sale Price)"}
            {localFilters.listingType === "rent" && " (Monthly Rent)"}
            {localFilters.listingType === "lease" && " (Lease Amount)"}
          </Label>
          <div className="px-2">
            <Slider
              value={localFilters.priceRange}
              onValueChange={(value) => updateFilter("priceRange", value)}
              max={localFilters.listingType === "sale" ? 2000000 : 100000000}
              min={0}
              step={localFilters.listingType === "sale" ? 10000 : 100}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>₦{localFilters.priceRange[0].toLocaleString()}</span>
            <span>₦{localFilters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Bedrooms</Label>
          <Select
            value={localFilters.bedrooms}
            onValueChange={(value) => updateFilter("bedrooms", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="0">Studio</SelectItem>
              <SelectItem value="1">1 Bedroom</SelectItem>
              <SelectItem value="2">2 Bedrooms</SelectItem>
              <SelectItem value="3">3 Bedrooms</SelectItem>
              <SelectItem value="4">4+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Property Type</Label>
          <Select
            value={localFilters.propertyType}
            onValueChange={(value) => updateFilter("propertyType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Amenities</Label>
          <div className="space-y-2">
            {amenityOptions.map((amenity) => {
              const Icon = amenity.icon;
              const isChecked =
                localFilters.amenities?.includes(amenity.id) || false;
              return (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity.id}
                    checked={isChecked}
                    onCheckedChange={() => toggleAmenity(amenity.id)}
                  />
                  <Label
                    htmlFor={amenity.id}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <Icon className="h-4 w-4" />
                    {amenity.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters() && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {localFilters.location && (
                <Badge variant="secondary" className="text-xs">
                  {localFilters.location}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => updateFilter("location", "")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {localFilters.listingType &&
                localFilters.listingType !== "any" && (
                  <Badge variant="secondary" className="text-xs">
                    {
                      listingTypes.find(
                        (t) => t.value === localFilters.listingType
                      )?.label
                    }
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => updateFilter("listingType", "any")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              {localFilters.bedrooms !== "any" && (
                <Badge variant="secondary" className="text-xs">
                  {localFilters.bedrooms === "0"
                    ? "Studio"
                    : `${localFilters.bedrooms} bed`}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => updateFilter("bedrooms", "any")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {localFilters.amenities?.map((amenityId) => {
                const amenity = amenityOptions.find((a) => a.id === amenityId);
                return amenity ? (
                  <Badge
                    key={amenityId}
                    variant="secondary"
                    className="text-xs"
                  >
                    {amenity.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => toggleAmenity(amenityId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   Filter,
//   X,
//   Wifi,
//   Car,
//   PawPrint,
//   Dumbbell,
//   Waves,
//   Shield,
//   Clock,
// } from "lucide-react";

// interface SearchFiltersProps {
//   filters: {
//     priceRange: [number, number];
//     bedrooms: string;
//     amenities: string[];
//     propertyType: string;
//     location: string;
//   };
//   onFiltersChange: (filters: any) => void;
//   onClearFilters: () => void;
//   className?: string;
//   variant?: "sidebar" | "mobile";
// }

// const amenityOptions = [
//   { id: "wifi", label: "WiFi", icon: Wifi },
//   { id: "parking", label: "Parking", icon: Car },
//   { id: "pets", label: "Pet Friendly", icon: PawPrint },
//   { id: "gym", label: "Fitness Center", icon: Dumbbell },
//   { id: "pool", label: "Swimming Pool", icon: Waves },
//   { id: "security", label: "24/7 Security", icon: Shield },
//   { id: "concierge", label: "Concierge", icon: Clock },
// ];

// const propertyTypes = [
//   { value: "any", label: "Any Type" },
//   { value: "apartment", label: "Apartment" },
//   { value: "house", label: "House" },
//   { value: "condo", label: "Condo" },
//   { value: "townhouse", label: "Townhouse" },
//   { value: "studio", label: "Studio" },
//   { value: "loft", label: "Loft" },
// ];

// export function SearchFilters({
//   filters,
//   onFiltersChange,
//   onClearFilters,
//   className,
//   variant = "sidebar",
// }: SearchFiltersProps) {
//   const [isOpen, setIsOpen] = useState(false);

//   const updateFilter = (key: string, value: any) => {
//     onFiltersChange({ ...filters, [key]: value });
//   };

//   const toggleAmenity = (amenityId: string) => {
//     const newAmenities = filters.amenities.includes(amenityId)
//       ? filters.amenities.filter((id) => id !== amenityId)
//       : [...filters.amenities, amenityId];
//     updateFilter("amenities", newAmenities);
//   };

//   const getActiveFiltersCount = () => {
//     let count = 0;
//     if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) count++;
//     if (filters.bedrooms !== "any") count++;
//     if (filters.amenities.length > 0) count++;
//     if (filters.propertyType !== "any") count++;
//     if (filters.location) count++;
//     return count;
//   };

//   const FilterContent = () => (
//     <div className="space-y-6">
//       {/* Location */}
//       <div className="space-y-2">
//         <Label htmlFor="location">Location</Label>
//         <Input
//           id="location"
//           placeholder="Enter city or neighborhood"
//           value={filters.location}
//           onChange={(e) => updateFilter("location", e.target.value)}
//         />
//       </div>

//       <Separator />

//       {/* Price Range */}
//       <div className="space-y-3">
//         <Label>Price Range</Label>
//         <Slider
//           value={filters.priceRange}
//           onValueChange={(value) => updateFilter("priceRange", value)}
//           max={5000}
//           min={0}
//           step={100}
//           className="mb-2"
//         />
//         <div className="flex justify-between text-sm text-gray-500">
//           <span>${filters.priceRange[0]}</span>
//           <span>${filters.priceRange[1]}</span>
//         </div>
//       </div>

//       <Separator />

//       {/* Property Type */}
//       <div className="space-y-2">
//         <Label>Property Type</Label>
//         <Select
//           value={filters.propertyType}
//           onValueChange={(value) => updateFilter("propertyType", value)}
//         >
//           <SelectTrigger>
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             {propertyTypes.map((type) => (
//               <SelectItem key={type.value} value={type.value}>
//                 {type.label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <Separator />

//       {/* Bedrooms */}
//       <div className="space-y-2">
//         <Label>Bedrooms</Label>
//         <Select
//           value={filters.bedrooms}
//           onValueChange={(value) => updateFilter("bedrooms", value)}
//         >
//           <SelectTrigger>
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="any">Any</SelectItem>
//             <SelectItem value="0">Studio</SelectItem>
//             <SelectItem value="1">1 Bedroom</SelectItem>
//             <SelectItem value="2">2 Bedrooms</SelectItem>
//             <SelectItem value="3">3 Bedrooms</SelectItem>
//             <SelectItem value="4">4+ Bedrooms</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <Separator />

//       {/* Amenities */}
//       <div className="space-y-3">
//         <Label>Amenities</Label>
//         <div className="grid grid-cols-1 gap-3">
//           {amenityOptions.map((amenity) => {
//             const Icon = amenity.icon;
//             return (
//               <div key={amenity.id} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={amenity.id}
//                   checked={filters.amenities.includes(amenity.id)}
//                   onCheckedChange={() => toggleAmenity(amenity.id)}
//                 />
//                 <Label
//                   htmlFor={amenity.id}
//                   className="flex items-center gap-2 cursor-pointer"
//                 >
//                   <Icon className="h-4 w-4" />
//                   {amenity.label}
//                 </Label>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <Separator />

//       {/* Clear Filters */}
//       <Button
//         variant="outline"
//         onClick={onClearFilters}
//         className="w-full bg-transparent"
//       >
//         <X className="h-4 w-4 mr-2" />
//         Clear All Filters
//       </Button>
//     </div>
//   );

//   if (variant === "mobile") {
//     return (
//       <Sheet open={isOpen} onOpenChange={setIsOpen}>
//         <SheetTrigger asChild>
//           <Button variant="outline" className="relative bg-transparent">
//             <Filter className="h-4 w-4 mr-2" />
//             Filters
//             {getActiveFiltersCount() > 0 && (
//               <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
//                 {getActiveFiltersCount()}
//               </Badge>
//             )}
//           </Button>
//         </SheetTrigger>
//         <SheetContent side="left" className="w-[300px] sm:w-[400px]">
//           <SheetHeader>
//             <SheetTitle>Filters</SheetTitle>
//             <SheetDescription>
//               Refine your search to find the perfect property
//             </SheetDescription>
//           </SheetHeader>
//           <div className="mt-6">
//             <FilterContent />
//           </div>
//         </SheetContent>
//       </Sheet>
//     );
//   }

//   return (
//     <Card className={className}>
//       <CardHeader>
//         <CardTitle className="flex items-center justify-between">
//           <span>Filters</span>
//           {getActiveFiltersCount() > 0 && (
//             <Badge variant="secondary">{getActiveFiltersCount()} active</Badge>
//           )}
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <FilterContent />
//       </CardContent>
//     </Card>
//   );
// }
