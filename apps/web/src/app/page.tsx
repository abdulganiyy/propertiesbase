"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  DollarSign,
  Shield,
  Search,
  MessageCircle,
  CheckCircle,
  Star,
  MapPin,
  TrendingUp,
  UserCheck,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import {
  useProperties,
  useFavorites,
  useToggleFavorite,
} from "@/hooks/use-properties";
import { PropertyCard } from "@/components/shared/property-card";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const router = useRouter();

  const { data, isLoading, error, refetch } = useProperties({
    page: 1,
    limit: 3,
    sortBy: "featured",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Build search parameters
    const searchParams = new URLSearchParams();

    if (searchQuery.trim()) {
      searchParams.set("search", searchQuery.trim());
    }

    if (minPrice) {
      searchParams.set("minPrice", minPrice);
    }

    if (maxPrice) {
      searchParams.set("maxPrice", maxPrice);
    }

    // Navigate to listings page with search parameters
    const queryString = searchParams.toString();
    router.push(`/listings${queryString ? `?${queryString}` : ""}`);
  };

  const toggleFavoriteMutation = useToggleFavorite();

  const toggleFavorite = async (propertyId: string) => {
    // Trigger mutation with updated parameters

    await toggleFavoriteMutation.mutateAsync(propertyId);
  };

  const { data: favorites } = useFavorites();

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
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-blue-50 to-white">
          <div className="mx-auto container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-fit">
                    No Agent Fees • Direct Connection
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Rent Direct, Save More
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Connect directly with property owners and skip the
                    middleman. Save thousands on agent fees while finding your
                    perfect home.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/listings">
                    <Button size="lg" className="h-12">
                      <Search className="mr-2 h-4 w-4" />
                      Find Properties
                    </Button>
                  </Link>
                  <Link href="/signup/owner">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 bg-transparent"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      List Your Property
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {/* <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>10,000+ Properties</span>
                  </div> */}
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Verified Owners</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Zero Agent Fees</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  alt="Modern apartment building"
                  className="aspect-video overflow-hidden rounded-xl object-cover"
                  height="400"
                  src="/hero-image.jpg"
                  width="600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="w-full py-8 bg-white border-b">
          <div className="mx-auto container px-4 md:px-6">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-6">
                <form onSubmit={handleSearch}>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter city, neighborhood, or address"
                        className="h-12"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min Price"
                        className="md:h-12 md:w-32"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                      <Input
                        placeholder="Max Price"
                        className="md:h-12 md:w-32"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                    <Button type="submit" size="lg" className="h-12 px-8">
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="about-us" className="w-full py-12 md:py-24 lg:py-32">
          <div className="mx-auto container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Why Choose PropertiesBase?
              </h2>
              <p className="mt-4 text-gray-500 md:text-xl">
                Save money, time, and hassle by connecting directly with
                property owners
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <DollarSign className="h-10 w-10 text-green-500" />
                  <CardTitle>Save on Fees</CardTitle>
                  <CardDescription>
                    No agent commissions or hidden fees. Keep more money in your
                    pocket.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <MessageCircle className="h-10 w-10 text-blue-500" />
                  <CardTitle>Direct Communication</CardTitle>
                  <CardDescription>
                    Chat directly with property owners for faster responses and
                    better deals.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 text-purple-500" />
                  <CardTitle>Verified Listings</CardTitle>
                  <CardDescription>
                    All properties and owners are verified for your safety and
                    peace of mind.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="h-10 w-10 text-orange-500" />
                  <CardTitle>Faster Process</CardTitle>
                  <CardDescription>
                    Skip the middleman and move in faster with streamlined
                    applications.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-red-500" />
                  <CardTitle>Better Deals</CardTitle>
                  <CardDescription>
                    Negotiate directly with owners for better prices and
                    flexible terms.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <UserCheck className="h-10 w-10 text-indigo-500" />
                  <CardTitle>Trusted Platform</CardTitle>
                  <CardDescription>
                    Background checks, reviews, and secure payments protect
                    everyone.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-50"
        >
          <div className="mx-auto container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                How It Works
              </h2>
              <p className="mt-4 text-gray-500 md:text-xl">
                Simple steps to find your next home or list your property
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {/* For Renters */}
              <div>
                <h3 className="text-2xl font-bold mb-6">For Renters</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Search Properties</h4>
                      <p className="text-gray-500">
                        Browse thousands of verified listings in your area
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Contact Owners</h4>
                      <p className="text-gray-500">
                        Message property owners directly through our platform
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Schedule Viewing</h4>
                      <p className="text-gray-500">
                        Book tours and view properties at your convenience
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">Move In</h4>
                      <p className="text-gray-500">
                        Complete application and move into your new home
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* For Property Owners */}
              <div>
                <h3 className="text-2xl font-bold mb-6">For Property Owners</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">List Your Property</h4>
                      <p className="text-gray-500">
                        Create a detailed listing with photos and descriptions
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Get Verified</h4>
                      <p className="text-gray-500">
                        Complete our quick verification process
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Connect with Renters</h4>
                      <p className="text-gray-500">
                        Receive inquiries and chat with potential tenants
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">Rent Out</h4>
                      <p className="text-gray-500">
                        Screen tenants and finalize rental agreements
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties */}

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="mx-auto container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Featured Properties
              </h2>
              <p className="mt-4 text-gray-500 md:text-xl">
                Discover amazing properties available for direct rental
              </p>
            </div>
            {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="relative">
                    <Image
                      alt={`Property ${i}`}
                      className="aspect-video object-cover w-full"
                      height="200"
                      src={`/hero-image.jpg`}
                      width="300"
                    />
                    <Badge className="absolute top-2 left-2 bg-green-500">
                      Direct Owner
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Modern 2BR Apartment</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">4.8</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">Downtown, City Center</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">$2,400</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div> */}
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
            {isLoading && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Properties Grid */}
            {!isLoading && !error && data && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.properties.map((property) => (
                  <PropertyCard
                    variant="featured"
                    key={property.id}
                    property={property}
                    onFavoriteToggle={toggleFavorite}
                    // onPrefetch={prefetchProperty as any}
                    isFavorite={favorites
                      ?.map((property: any) => property.property.id)
                      .includes(property.id)}
                    isToggling={toggleFavoriteMutation.isPending}
                  />
                ))}
              </div>
            )}
            <div className="text-center mt-8">
              <Link href={"/listings"}>
                <Button size="lg" className="cursor-pointer">
                  View All Properties
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="mx-auto container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                What Our Users Say
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Saved over $200 in agent fees and found the perfect
                    apartment. The direct communication with the owner made
                    everything so much easier!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      S
                    </div>
                    <div>
                      <p className="font-semibold">Sarah Johnson</p>
                      <p className="text-sm text-gray-500">Renter</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "As a property owner, I love having direct control over who
                    rents my property. No more agent commissions eating into my
                    profits!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div>
                      <p className="font-semibold">Adams Bako</p>
                      <p className="text-sm text-gray-500">Property Owner</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "The platform is so easy to use and the verification process
                    gives me confidence in both renters and properties."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      J
                    </div>
                    <div>
                      <p className="font-semibold">Okunola James</p>
                      <p className="text-sm text-gray-500">Renter</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-400 text-white">
          <div className="mx-auto container px-4 md:px-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Ready to Skip the Middleman?
              </h2>
              <p className="mx-auto max-w-[600px] text-blue-100 md:text-xl">
                Join thousands of renters and property owners who are saving
                money and time with DirectRent.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Link href="/listings">
                  <Button size="lg" variant="secondary" className="h-12">
                    <Search className="mr-2 h-4 w-4" />
                    Start Searching
                  </Button>
                </Link>
                <Link href="/signup/owner">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 border-white hover:bg-white bg-transparent"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    List Your Property
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
