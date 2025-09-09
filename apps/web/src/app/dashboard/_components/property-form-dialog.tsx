"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Upload,
  X,
  DollarSign,
  Wifi,
  Car,
  PawPrint,
  Dumbbell,
  Waves,
  Shield,
  Clock,
} from "lucide-react";
import { propertySchema, type PropertyFormData } from "@/schema/property";
import axios from "axios";
import { toast } from "sonner";
import { delay } from "@/lib/utils";

interface PropertyFormDialogProps {
  trigger?: React.ReactNode;
  property?: Partial<PropertyFormData>;
  onSubmit: (data: PropertyFormData | any) => Promise<void>;
  isEditing?: boolean;
  isPending?: boolean;
}

/* TODO: move secrets to environment variables */
const CLOUD_NAME = "dm49zhija"; // from cloudinary dashboard
const UPLOAD_PRESET = "jrlc8n92"; // your unsigned preset name

export function PropertyFormDialog({
  trigger,
  property,
  onSubmit,
  isEditing = false,
  isPending,
}: PropertyFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  //   const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const form = useForm<PropertyFormData>({
    resolver: yupResolver(propertySchema as any),
    defaultValues: {
      title: property?.title || "",
      description: property?.description || "",
      propertyType: property?.propertyType || "",
      listingType: property?.listingType || "",
      address: property?.address || "",
      city: property?.city || "",
      state: property?.state || "",
      //   zipCode: property?.zipCode || "",
      bedrooms: property?.bedrooms || "",
      bathrooms: property?.bathrooms || "",
      sqft: property?.sqft || 0,
      salePrice: property?.salePrice || 0,
      monthlyRent: property?.monthlyRent || 0,
      yearlyRent: property?.yearlyRent || 0,
      rentPeriod: property?.rentPeriod || "monthly",
      leaseAmount: property?.leaseAmount || 0,
      leaseDuration: property?.leaseDuration || "",
      securityDeposit: property?.securityDeposit || 0,
      availableDate: property?.availableDate || new Date(),
      email: property?.email || "",
      phoneNumber: property?.phoneNumber || "",
      images: property?.images || [],
      amenities: property?.amenities,
    },
  });

  const watchListingType = form.watch("listingType");
  const watchRentPeriod = form.watch("rentPeriod");

  const amenityOptions = [
    { id: "wifi", label: "High-Speed WiFi", icon: Wifi },
    { id: "parking", label: "Parking Included", icon: Car },
    { id: "pets", label: "Pet Friendly", icon: PawPrint },
    { id: "gym", label: "Fitness Center", icon: Dumbbell },
    { id: "pool", label: "Swimming Pool", icon: Waves },
    { id: "security", label: "24/7 Security", icon: Shield },
    { id: "concierge", label: "Concierge Service", icon: Clock },
  ];

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );

      //   console.log("Upload successful:", response.data);

      return response.data.secure_url;
    } catch (err) {
      throw new Error("Upload failed");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploadingImages(true);
    const files = Array.from(e.target.files || []);

    let uploadedObjects;

    const filess = form.getValues("images");

    const hasFile = files.some((file) =>
      filess?.map((f) => f.filename).includes(file.name)
    );

    if (hasFile) {
      toast.error("File has been picked");
      return;
    }

    try {
      uploadedObjects = await Promise.all(
        files.map(async (file) => {
          const uploadUrl = await handleUpload(file);
          return {
            filename: file.name,
            url: uploadUrl,
            mimeType: file.type,
          };
        })
      );

      // console.log(uploadedObjects);

      toast("Upload successful");
      // Keep previously attached files and add new ones
      form.setValue("images", [
        ...filess,
        ...uploadedObjects.map((uploadedObject, i) => ({
          imageUrl: uploadedObject.url,
          isCover: i == 0 && true,
          propertyId: property?.id,
          filename: uploadedObject.filename,
        })),
      ]);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setIsUploadingImages(false);
    }
    // setUploadedImages((prev) => [...prev, ...files].slice(0, 10));
  };

  const removeImage = (url: string) => {
    // setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    let uploadedImages = form.getValues("images");

    let newUploadedImages = uploadedImages?.filter(
      (uploadedImages) => uploadedImages.imageUrl !== url
    );

    form.setValue("images", newUploadedImages);
  };

  const handleAmenityToggle = (amenityId: string) => {
    const amenities = selectedAmenities.includes(amenityId)
      ? selectedAmenities.filter((id) => id !== amenityId)
      : [...selectedAmenities, amenityId];

    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );

    form.setValue("amenities", amenities);
  };

  const handleSubmit = async (data: PropertyFormData) => {
    try {
      await onSubmit({ id: property?.id, ...data });

      if (isEditing) {
        toast("Property updated successfully");
      } else {
        toast("Property added successfully");
      }
    } catch (error) {
      if (isEditing) {
        toast("Unable to update property");
      } else {
        toast("Unable to add property");
      }
    } finally {
      form.reset();
      setCurrentStep(1);
      await delay(2000);
      setOpen(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof PropertyFormData)[] => {
    switch (step) {
      case 1:
        return ["title", "description", "propertyType", "listingType"];
      case 2:
        return [
          "address",
          "city",
          "state",
          //   "zipCode",
          "bedrooms",
          "bathrooms",
          "sqft",
        ];
      case 3:
        const baseFields: (keyof PropertyFormData)[] = ["availableDate"];
        if (watchListingType === "sale") {
          baseFields.push("salePrice");
        } else if (watchListingType === "rent") {
          baseFields.push(
            "monthlyRent",
            "rentPeriod",
            "securityDeposit"
            // "leaseTerm"
          );
          if (watchRentPeriod === "yearly") {
            baseFields.push("yearlyRent");
          }
        } else if (watchListingType === "lease") {
          baseFields.push("leaseAmount", "leaseDuration", "securityDeposit");
        }
        return baseFields;
      case 4:
        return ["email"];
      default:
        return [];
    }
  };

  let uploadedImages = form.getValues("images");

  // console.log(uploadedImages);
  // console.log(form.getValues());

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {isEditing ? "Edit Property" : "Add Property"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Property" : "Add New Property"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your property information"
              : "Create a new property listing"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-6">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-16 h-0.5 mx-2 ${currentStep > step ? "bg-primary" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Modern Downtown Loft with City Views"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="condo">Condo</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="loft">Loft</SelectItem>
                            <SelectItem value="hotel">Hotel</SelectItem>
                            <SelectItem value="officespace">
                              Office Space
                            </SelectItem>
                            <SelectItem value="shop">Shop</SelectItem>
                            <SelectItem value="terracedduplex">
                              Terraced Duplex
                            </SelectItem>
                            <SelectItem value="warehouse">Warehouse</SelectItem>
                            <SelectItem value="bakery">Bakery</SelectItem>
                            <SelectItem value="business center">
                              Business Center
                            </SelectItem>
                            <SelectItem value="factory">Factory</SelectItem>
                            <SelectItem value="fillingstation">
                              Filling Station
                            </SelectItem>
                            <SelectItem value="fish farm">Fish Farm</SelectItem>
                            <SelectItem value="garage">Garage</SelectItem>
                            <SelectItem value="gas plant">Gas Plant</SelectItem>
                            <SelectItem value="hall">Hall</SelectItem>
                            <SelectItem value="hospital">Hospital</SelectItem>
                            <SelectItem value="hostel">Hostel</SelectItem>
                            <SelectItem value="laundry business">
                              Laundry Business
                            </SelectItem>
                            <SelectItem value="open space">
                              Open Space
                            </SelectItem>
                            <SelectItem value="pharmacy">Pharmacy</SelectItem>
                            <SelectItem value="plaza">Plaza</SelectItem>
                            <SelectItem value="poultry">
                              Poultry Farm
                            </SelectItem>
                            <SelectItem value="recreation center">
                              Recreation Center
                            </SelectItem>
                            <SelectItem value="restaurant">
                              Restaurant
                            </SelectItem>
                            <SelectItem value="salon">Salon</SelectItem>
                            <SelectItem value="school">School</SelectItem>
                            <SelectItem value="showroom">Showroom</SelectItem>
                            <SelectItem value="supermarket">
                              Supermarket
                            </SelectItem>
                            <SelectItem value="tank farm">Tank Farm</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="listingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select listing type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sale">For Sale</SelectItem>
                            <SelectItem value="rent">For Rent</SelectItem>
                            <SelectItem value="lease">For Lease</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your property, its features, and what makes it special..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: Location & Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location & Details</h3>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>

                <Separator />

                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Beds" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Studio</SelectItem>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Baths" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="1.5">1.5</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="2.5">2.5</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="3.5">3.5</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sqft"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Square Feet *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1200"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <Label>Year Built</Label>
                    <Input placeholder="2020" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Pricing & Terms */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Pricing & Terms</h3>

                {/* Sale Pricing */}
                {watchListingType === "sale" && (
                  <div className="space-y-4">
                    <h4 className="text-md font-medium">Sale Information</h4>
                    <FormField
                      control={form.control}
                      name="salePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sale Price *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-3.5 transform -translate-y-1/2 h-4 w-4 text-gray-400">
                                ₦
                              </span>{" "}
                              <Input
                                type="number"
                                placeholder="450000"
                                className="pl-10"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Rent Pricing */}
                {watchListingType === "rent" && (
                  <div className="space-y-4">
                    <h4 className="text-md font-medium">Rental Information</h4>

                    <FormField
                      control={form.control}
                      name="rentPeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rent Period *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select rent period" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      {watchRentPeriod === "monthly" && (
                        <FormField
                          control={form.control}
                          name="monthlyRent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Rent *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-3.5 transform -translate-y-1/2 h-4 w-4 text-gray-400">
                                    ₦
                                  </span>
                                  {/* <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /> */}
                                  <Input
                                    type="number"
                                    placeholder="2400"
                                    className="pl-10"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {watchRentPeriod === "yearly" && (
                        <FormField
                          control={form.control}
                          name="yearlyRent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Yearly Rent *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-3.5 transform -translate-y-1/2 h-4 w-4 text-gray-400">
                                    ₦
                                  </span>
                                  <Input
                                    type="number"
                                    placeholder="28800"
                                    className="pl-10"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="securityDeposit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Security Deposit *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-3.5 transform -translate-y-1/2 h-4 w-4 text-gray-400">
                                  ₦
                                </span>
                                <Input
                                  type="number"
                                  placeholder="2400"
                                  className="pl-10"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* <FormField
                      control={form.control}
                      name="leaseTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lease Term *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select lease term" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="6-months">6 Months</SelectItem>
                              <SelectItem value="12-months">
                                12 Months
                              </SelectItem>
                              <SelectItem value="18-months">
                                18 Months
                              </SelectItem>
                              <SelectItem value="24-months">
                                24 Months
                              </SelectItem>
                              <SelectItem value="month-to-month">
                                Month to Month
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                  </div>
                )}

                {/* Lease Pricing */}
                {watchListingType === "lease" && (
                  <div className="space-y-4">
                    <h4 className="text-md font-medium">Lease Information</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="leaseAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lease Amount *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-3.5 transform -translate-y-1/2 h-4 w-4 text-gray-400">
                                  ₦
                                </span>{" "}
                                <Input
                                  type="number"
                                  placeholder="50000"
                                  className="pl-10"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="leaseDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lease Duration *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1-year">1 Year</SelectItem>
                                <SelectItem value="2-years">2 Years</SelectItem>
                                <SelectItem value="3-years">3 Years</SelectItem>
                                <SelectItem value="5-years">5 Years</SelectItem>
                                <SelectItem value="10-years">
                                  10 Years
                                </SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="securityDeposit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Security Deposit *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-3.5 transform -translate-y-1/2 h-4 w-4 text-gray-400">
                                ₦
                              </span>
                              <Input
                                type="number"
                                placeholder="10000"
                                className="pl-10"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <Separator />

                <div>
                  <Label className="text-base font-medium">Amenities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                    {amenityOptions.map((amenity) => {
                      const Icon = amenity.icon;
                      return (
                        <div
                          key={amenity.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={amenity.id}
                            checked={selectedAmenities.includes(amenity.id)}
                            onCheckedChange={() =>
                              handleAmenityToggle(amenity.id)
                            }
                          />
                          <Label
                            htmlFor={amenity.id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Icon className="h-4 w-4" />
                            {amenity.label}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                <FormField
                  control={form.control}
                  name="availableDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Date *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().split("T")[0]
                              : field.value
                          }
                          onChange={(e) =>
                            field.onChange(new Date(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 4: Photos & Contact */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Photos & Contact</h3>
                <span className="text-destructive text-sm">
                  {form.formState.errors.images?.message}
                </span>
                <div>
                  <Label className="text-base font-medium">
                    Property Photos *
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mt-2">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="images" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload property photos
                          </span>
                          <span className="mt-1 block text-sm text-gray-500">
                            PNG, JPG, GIF up to 10MB each (max 10 photos)
                          </span>
                        </label>
                        <input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                      <Button
                        type="button"
                        className="mt-4"
                        onClick={() =>
                          document.getElementById("images")?.click()
                        }
                      >
                        Choose Files
                      </Button>
                    </div>
                  </div>

                  {isUploadingImages && <span>Images uplooading</span>}

                  {uploadedImages?.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {uploadedImages?.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            // src={
                            //   URL.createObjectURL(file) || "/placeholder.svg"
                            // }
                            src={file.imageUrl}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => removeImage(file.imageUrl)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isPending}>
                  {isPending
                    ? "Submitting..."
                    : isEditing
                      ? "Update Property"
                      : "Create Property"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
