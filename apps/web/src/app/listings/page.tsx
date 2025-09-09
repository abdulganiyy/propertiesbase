"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Home,
  Grid3X3,
  List,
  Map,
  Wifi,
  Car,
  PawPrint,
  Dumbbell,
  Waves,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";
import {
  useProperties,
  useToggleFavorite,
  usePrefetchProperty,
  useFavorites,
} from "@/hooks/use-properties";
import type { PropertyFilters } from "@/lib/api";
import { PageLayout } from "@/components/shared/page-layout";
import { SearchFilters } from "@/components/shared/search-filter";
import { PropertyCard } from "@/components/shared/property-card";
import { EmptyState } from "@/components/shared/empty-state";
import { useSearchParams, useRouter } from "next/navigation";

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  pets: PawPrint,
  gym: Dumbbell,
  pool: Waves,
};

export default function ListingsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000000000]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>("any");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedListingType, setSelectedListingType] = useState<string>("any");
  const [selectedPropertyType, setSelectedPropertyType] =
    useState<string>("any");
  const [sortBy, setSortBy] = useState("featured");
  // const [favorites, setFavorites] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize filters from URL parameters
  useEffect(() => {
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    if (search) setSearchQuery(search);
    if (minPrice || maxPrice) {
      setPriceRange([
        minPrice ? Number.parseInt(minPrice) : 0,
        maxPrice ? Number.parseInt(maxPrice) : 5000000000,
      ]);
    }
  }, [searchParams]);

  // Create filters object
  const filters: PropertyFilters = useMemo(
    () => ({
      search: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      bedrooms: selectedBedrooms === "any" ? undefined : selectedBedrooms,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      listingType:
        selectedListingType === "any"
          ? undefined
          : (selectedListingType as "sale" | "rent" | "lease"),
      propertyType:
        selectedPropertyType === "any" ? undefined : selectedPropertyType,
      sortBy,
      page: 1,
      limit: 10,
    }),
    [
      searchQuery,
      priceRange,
      selectedBedrooms,
      selectedAmenities,
      selectedListingType,
      selectedPropertyType,
      sortBy,
      searchParams,
    ]
  );

  // Fetch properties using React Query
  const { data, isLoading, error, refetch } = useProperties(filters);
  const toggleFavoriteMutation = useToggleFavorite();
  const prefetchProperty = usePrefetchProperty();

  const { data: favorites } = useFavorites();

  const toggleFavorite = async (propertyId: string) => {
    // Optimistic update

    // Trigger mutation with updated parameters

    await toggleFavoriteMutation.mutateAsync(propertyId);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 5000000000]);
    setSelectedBedrooms("any");
    setSelectedAmenities([]);
    setSelectedListingType("any");
    setSelectedPropertyType("any");
    setSortBy("featured");

    router.push("/listings");
  };

  const PropertyCardSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        <div className="flex gap-4 mb-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout showSearch={true}>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden md:block w-84 flex-shrink-0">
              <SearchFilters
                filters={{
                  priceRange,
                  bedrooms: selectedBedrooms,
                  amenities: selectedAmenities,
                  propertyType: selectedPropertyType,
                  location: searchQuery,
                  listingType: selectedListingType,
                }}
                onFiltersChange={(newFilters) => {
                  setPriceRange(newFilters.priceRange);
                  setSelectedBedrooms(newFilters.bedrooms);
                  setSelectedAmenities(newFilters.amenities);
                  setSelectedPropertyType(newFilters.propertyType);
                  setSearchQuery(newFilters.location);
                  setSelectedListingType(newFilters.listingType);
                }}
                onClearFilters={clearAllFilters}
                className="sticky top-24"
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filter Button */}
              <div className="md:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="w-full"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters & Sort
                </Button>
              </div>

              {/* Mobile Filters */}
              {showMobileFilters && (
                <div className="md:hidden mb-6">
                  <SearchFilters
                    filters={{
                      priceRange,
                      bedrooms: selectedBedrooms,
                      amenities: selectedAmenities,
                      propertyType: selectedPropertyType,
                      location: searchQuery,
                      listingType: selectedListingType,
                    }}
                    onFiltersChange={(newFilters) => {
                      setPriceRange(newFilters.priceRange);
                      setSelectedBedrooms(newFilters.bedrooms);
                      setSelectedAmenities(newFilters.amenities);
                      setSelectedPropertyType(newFilters.propertyType);
                      setSearchQuery(newFilters.location);
                      setSelectedListingType(newFilters.listingType);
                    }}
                    onClearFilters={clearAllFilters}
                  />
                </div>
              )}

              {/* View Controls */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">
                    {isLoading ? (
                      <Skeleton className="h-8 w-48" />
                    ) : error ? (
                      "Error Loading Properties"
                    ) : (
                      `${data?.total || 0} Properties Available`
                    )}
                  </h1>
                  <p className="text-gray-500">
                    {selectedListingType === "sale" && "Properties for sale"}
                    {selectedListingType === "rent" && "Properties for rent"}
                    {selectedListingType === "lease" && "Properties for lease"}
                    {selectedListingType === "any" && "All property listings"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      {/*TODO: Map selected item value to correct database field*/}
                      {/* <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem> */}
                    </SelectContent>
                  </Select>
                  <div className="hidden sm:flex items-center gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    {/* <Button
                      variant={viewMode === "map" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("map")}
                    >
                      <Map className="h-4 w-4" />
                    </Button> */}
                  </div>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load properties. Please try again.
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2 bg-transparent"
                      onClick={() => refetch()}
                    >
                      Retry
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Loading State */}
              {isLoading && viewMode === "grid" && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <PropertyCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Properties Grid */}
              {!isLoading && !error && data && viewMode === "grid" && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {data.properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onFavoriteToggle={toggleFavorite}
                      onPrefetch={prefetchProperty as any}
                      isFavorite={favorites
                        ?.map((property: any) => property.property.id)
                        .includes(property.id)}
                      isToggling={toggleFavoriteMutation.isPending}
                    />
                  ))}
                </div>
              )}

              {/* Properties List */}
              {!isLoading && !error && data && viewMode === "list" && (
                <div className="space-y-4">
                  {data.properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      variant="compact"
                      onFavoriteToggle={toggleFavorite}
                      onPrefetch={prefetchProperty as any}
                      isFavorite={favorites
                        ?.map((property: any) => property.property.id)
                        .includes(property.id)}
                      isToggling={toggleFavoriteMutation.isPending}
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && data && data.properties.length === 0 && (
                <EmptyState
                  icon={<Home className="h-12 w-12" />}
                  title="No properties found"
                  description="Try adjusting your search criteria or filters"
                  action={{
                    label: "Clear Filters",
                    onClick: clearAllFilters,
                  }}
                />
              )}

              {/* Map View Placeholder */}
              {viewMode === "map" && (
                <Card className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <Map className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Map View</h3>
                    <p className="text-gray-500">
                      Interactive map with property locations would be displayed
                      here
                    </p>
                  </div>
                </Card>
              )}

              {/* Pagination */}
              {!isLoading && !error && data && data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button size="sm">2</Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// "use client";

// import { useState, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   Home,
//   Search,
//   Filter,
//   MapPin,
//   Star,
//   Bed,
//   Bath,
//   Square,
//   Heart,
//   MessageCircle,
//   Phone,
//   Grid3X3,
//   List,
//   Map,
//   SlidersHorizontal,
//   Wifi,
//   Car,
//   PawPrint,
//   Dumbbell,
//   Waves,
//   ChevronLeft,
//   ChevronRight,
//   AlertCircle,
//   Loader2,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   useProperties,
//   useToggleFavorite,
//   usePrefetchProperty,
// } from "@/hooks/use-properties";
// import type { PropertyFilters } from "@/lib/api";
// import { Header } from "@/components/shared/header";
// import { Footer } from "@/components/shared/footer";

// const amenityIcons = {
//   wifi: Wifi,
//   parking: Car,
//   pets: PawPrint,
//   gym: Dumbbell,
//   pool: Waves,
// };

// export default function ListingsPage() {
//   const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [priceRange, setPriceRange] = useState([0, 5000]);
//   const [selectedBedrooms, setSelectedBedrooms] = useState<string>("any");
//   const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
//   const [sortBy, setSortBy] = useState("featured");
//   const [favorites, setFavorites] = useState<number[]>([]);

//   // Create filters object
//   const filters: PropertyFilters = useMemo(
//     () => ({
//       search: searchQuery || undefined,
//       minPrice: priceRange[0],
//       maxPrice: priceRange[1],
//       bedrooms: selectedBedrooms === "any" ? undefined : selectedBedrooms,
//       amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
//       sortBy,
//       page: 1,
//       limit: 20,
//     }),
//     [searchQuery, priceRange, selectedBedrooms, selectedAmenities, sortBy]
//   );

//   // Fetch properties using React Query
//   const { data, isLoading, error, refetch } = useProperties(filters);
//   const toggleFavoriteMutation = useToggleFavorite();
//   const prefetchProperty = usePrefetchProperty();

//   const toggleFavorite = (propertyId: number) => {
//     // Optimistic update
//     setFavorites((prev) =>
//       prev.includes(propertyId)
//         ? prev.filter((id) => id !== propertyId)
//         : [...prev, propertyId]
//     );

//     // Trigger mutation
//     toggleFavoriteMutation.mutate(propertyId, {
//       onError: () => {
//         // Revert optimistic update on error
//         setFavorites((prev) =>
//           prev.includes(propertyId)
//             ? prev.filter((id) => id !== propertyId)
//             : [...prev, propertyId]
//         );
//       },
//     });
//   };

//   const FilterSidebar = () => (
//     <div className="space-y-6">
//       <div>
//         <h3 className="font-semibold mb-3">Price Range</h3>
//         <Slider
//           value={priceRange}
//           onValueChange={setPriceRange}
//           max={5000}
//           min={0}
//           step={100}
//           className="mb-2"
//         />
//         <div className="flex justify-between text-sm text-gray-500">
//           <span>${priceRange[0]}</span>
//           <span>${priceRange[1]}</span>
//         </div>
//       </div>

//       <div>
//         <h3 className="font-semibold mb-3">Bedrooms</h3>
//         <Select value={selectedBedrooms} onValueChange={setSelectedBedrooms}>
//           <SelectTrigger>
//             <SelectValue placeholder="Any" />
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

//       <div>
//         <h3 className="font-semibold mb-3">Amenities</h3>
//         <div className="space-y-2">
//           {Object.entries(amenityIcons).map(([amenity, Icon]) => (
//             <div key={amenity} className="flex items-center space-x-2">
//               <Checkbox
//                 id={amenity}
//                 checked={selectedAmenities.includes(amenity)}
//                 onCheckedChange={(checked) => {
//                   if (checked) {
//                     setSelectedAmenities([...selectedAmenities, amenity]);
//                   } else {
//                     setSelectedAmenities(
//                       selectedAmenities.filter((a) => a !== amenity)
//                     );
//                   }
//                 }}
//               />
//               <Label
//                 htmlFor={amenity}
//                 className="flex items-center gap-2 capitalize"
//               >
//                 <Icon className="h-4 w-4" />
//                 {amenity === "wifi" ? "WiFi" : amenity}
//               </Label>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const PropertyCardSkeleton = () => (
//     <Card className="overflow-hidden">
//       <Skeleton className="aspect-[4/3] w-full" />
//       <CardContent className="p-4">
//         <Skeleton className="h-6 w-3/4 mb-2" />
//         <Skeleton className="h-4 w-1/2 mb-3" />
//         <div className="flex gap-4 mb-3">
//           <Skeleton className="h-4 w-16" />
//           <Skeleton className="h-4 w-16" />
//           <Skeleton className="h-4 w-16" />
//         </div>
//         <div className="flex justify-between items-center mb-3">
//           <Skeleton className="h-8 w-24" />
//           <Skeleton className="h-4 w-20" />
//         </div>
//         <div className="flex gap-2">
//           <Skeleton className="h-8 flex-1" />
//           <Skeleton className="h-8 w-16" />
//         </div>
//       </CardContent>
//     </Card>
//   );

//   const PropertyCard = ({ property }: { property: any }) => (
//     <Card
//       className="overflow-hidden hover:shadow-lg transition-shadow"
//       onMouseEnter={() => prefetchProperty(property.id)}
//     >
//       <div className="relative">
//         <Link href={`/listings/${property.id}`}>
//           <Image
//             alt={property.title}
//             className="aspect-[4/3] object-cover w-full cursor-pointer"
//             height="300"
//             src={property.images[0] || "/placeholder.svg"}
//             width="400"
//           />
//         </Link>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="absolute top-2 right-2 bg-white/80 hover:bg-white"
//           onClick={() => toggleFavorite(property.id)}
//           disabled={toggleFavoriteMutation.isPending}
//         >
//           {toggleFavoriteMutation.isPending ? (
//             <Loader2 className="h-4 w-4 animate-spin" />
//           ) : (
//             <Heart
//               className={`h-4 w-4 ${favorites.includes(property.id) ? "fill-red-500 text-red-500" : ""}`}
//             />
//           )}
//         </Button>
//         {property.isDirectOwner && (
//           <Badge className="absolute top-2 left-2 bg-green-500">
//             Direct Owner
//           </Badge>
//         )}
//         {property.featured && (
//           <Badge className="absolute bottom-2 left-2 bg-blue-500">
//             Featured
//           </Badge>
//         )}
//       </div>
//       <CardContent className="p-4">
//         <div className="flex items-start justify-between mb-2">
//           <Link href={`/listings/${property.id}`}>
//             <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
//               {property.title}
//             </h3>
//           </Link>
//           <div className="flex items-center gap-1">
//             <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//             <span className="text-sm font-medium">{property.rating}</span>
//             <span className="text-sm text-gray-500">({property.reviews})</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-1 text-gray-500 mb-3">
//           <MapPin className="h-4 w-4" />
//           <span className="text-sm">{property.location}</span>
//         </div>

//         <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
//           <div className="flex items-center gap-1">
//             <Bed className="h-4 w-4" />
//             <span>
//               {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} bed`}
//             </span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Bath className="h-4 w-4" />
//             <span>{property.bathrooms} bath</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Square className="h-4 w-4" />
//             <span>{property.sqft} sqft</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 mb-3">
//           {property.amenities.slice(0, 3).map((amenity: any) => {
//             const Icon =
//               amenityIcons[amenity.icon as keyof typeof amenityIcons];
//             return Icon ? (
//               <Icon key={amenity.icon} className="h-4 w-4 text-gray-500" />
//             ) : null;
//           })}
//           {property.amenities.length > 3 && (
//             <span className="text-xs text-gray-500">
//               +{property.amenities.length - 3} more
//             </span>
//           )}
//         </div>

//         <div className="flex items-center justify-between mb-3">
//           <div>
//             <span className="text-2xl font-bold">${property.price}</span>
//             <span className="text-gray-500">/month</span>
//           </div>
//           <div className="text-right">
//             <div className="text-sm font-medium">{property.owner.name}</div>
//             <div className="flex items-center gap-1">
//               <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//               <span className="text-xs text-gray-500">
//                 {property.owner.rating} owner rating
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-2">
//           <Button className="flex-1" size="sm">
//             <MessageCircle className="h-4 w-4 mr-2" />
//             Message Owner
//           </Button>
//           <Button variant="outline" size="sm">
//             <Phone className="h-4 w-4 mr-2" />
//             Call
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <Header />

//       {/* Search Bar */}
//       <div className="bg-white border-b">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Search by location, property type, or keywords..."
//                 className="pl-10"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <div className="flex gap-2">
//               <Sheet>
//                 <SheetTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="md:hidden bg-transparent"
//                   >
//                     <Filter className="h-4 w-4 mr-2" />
//                     Filters
//                   </Button>
//                 </SheetTrigger>
//                 <SheetContent side="left">
//                   <SheetHeader>
//                     <SheetTitle>Filters</SheetTitle>
//                     <SheetDescription>
//                       Refine your search to find the perfect property
//                     </SheetDescription>
//                   </SheetHeader>
//                   <div className="mt-6">
//                     <FilterSidebar />
//                   </div>
//                 </SheetContent>
//               </Sheet>
//               <Select value={sortBy} onValueChange={setSortBy}>
//                 <SelectTrigger className="w-[180px]">
//                   <SlidersHorizontal className="h-4 w-4 mr-2" />
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="featured">Featured First</SelectItem>
//                   <SelectItem value="price-low">Price: Low to High</SelectItem>
//                   <SelectItem value="price-high">Price: High to Low</SelectItem>
//                   <SelectItem value="rating">Highest Rated</SelectItem>
//                   <SelectItem value="newest">Newest First</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-6">
//         <div className="flex gap-6">
//           {/* Sidebar Filters - Desktop */}
//           <div className="hidden md:block w-64 flex-shrink-0">
//             <Card className="p-6 sticky top-24">
//               <h2 className="font-semibold text-lg mb-4">Filters</h2>
//               <FilterSidebar />
//             </Card>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1">
//             {/* View Controls */}
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h1 className="text-2xl font-bold">
//                   {isLoading ? (
//                     <Skeleton className="h-8 w-48" />
//                   ) : error ? (
//                     "Error Loading Properties"
//                   ) : (
//                     `${data?.total || 0} Properties Available`
//                   )}
//                 </h1>
//                 <p className="text-gray-500">Direct from property owners</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant={viewMode === "grid" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setViewMode("grid")}
//                 >
//                   <Grid3X3 className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant={viewMode === "list" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setViewMode("list")}
//                 >
//                   <List className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant={viewMode === "map" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setViewMode("map")}
//                 >
//                   <Map className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>

//             {/* Error State */}
//             {error && (
//               <Alert className="mb-6">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>
//                   Failed to load properties. Please try again.
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="ml-2 bg-transparent"
//                     onClick={() => refetch()}
//                   >
//                     Retry
//                   </Button>
//                 </AlertDescription>
//               </Alert>
//             )}

//             {/* Loading State */}
//             {isLoading && viewMode === "grid" && (
//               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                 {Array.from({ length: 6 }).map((_, index) => (
//                   <PropertyCardSkeleton key={index} />
//                 ))}
//               </div>
//             )}

//             {/* Properties Grid */}
//             {!isLoading && !error && data && viewMode === "grid" && (
//               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                 {data.properties.map((property) => (
//                   <PropertyCard key={property.id} property={property} />
//                 ))}
//               </div>
//             )}

//             {/* Empty State */}
//             {!isLoading && !error && data && data.properties.length === 0 && (
//               <div className="text-center py-12">
//                 <Home className="h-12 w-12 mx-auto mb-4 text-gray-400" />
//                 <h3 className="text-lg font-semibold mb-2">
//                   No properties found
//                 </h3>
//                 <p className="text-gray-500 mb-4">
//                   Try adjusting your search criteria or filters
//                 </p>
//                 <Button
//                   onClick={() => {
//                     setSearchQuery("");
//                     setPriceRange([0, 5000]);
//                     setSelectedBedrooms("any");
//                     setSelectedAmenities([]);
//                     setSortBy("featured");
//                   }}
//                 >
//                   Clear Filters
//                 </Button>
//               </div>
//             )}

//             {/* Map View Placeholder */}
//             {viewMode === "map" && (
//               <Card className="h-96 flex items-center justify-center">
//                 <div className="text-center">
//                   <Map className="h-12 w-12 mx-auto mb-4 text-gray-400" />
//                   <h3 className="text-lg font-semibold mb-2">Map View</h3>
//                   <p className="text-gray-500">
//                     Interactive map with property locations would be displayed
//                     here
//                   </p>
//                 </div>
//               </Card>
//             )}

//             {/* Pagination */}
//             {!isLoading && !error && data && data.totalPages > 1 && (
//               <div className="flex items-center justify-center gap-2 mt-8">
//                 <Button variant="outline" size="sm">
//                   <ChevronLeft className="h-4 w-4 mr-2" />
//                   Previous
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   1
//                 </Button>
//                 <Button size="sm">2</Button>
//                 <Button variant="outline" size="sm">
//                   3
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   Next
//                   <ChevronRight className="h-4 w-4 ml-2" />
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }
