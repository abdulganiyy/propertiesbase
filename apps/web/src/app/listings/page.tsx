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
