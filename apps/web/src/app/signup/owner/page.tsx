"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  Users,
  DollarSign,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  TrendingUp,
  Award,
  Zap,
  Home,
  Key,
  FileText,
  Target,
} from "lucide-react";
import { PageLayout } from "@/components/shared/page-layout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { delay } from "@/lib/utils";

const ownerOnboardingSchema = yup.object({
  // Personal Information
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),

  // Property Owner Type
  ownerType: yup
    .string()
    .oneOf(["individual", "company", "property_manager"])
    .required("Owner type is required"),
  //   companyName: yup.string().when("ownerType", {
  //     is: (val: string) => val === "company" || val === "property_manager",
  //     then: (schema) => schema.required("Company name is required"),
  //     otherwise: (schema) => schema.notRequired(),
  //   }),

  // Experience
  experience: yup
    .string()
    .oneOf(["first_time", "some_experience", "experienced"])
    .required("Experience level is required"),
  propertiesOwned: yup
    .number()
    .min(0, "Must be 0 or greater")
    .required("Number of properties is required"),

  // Property Information and Listing Intentions
  propertyTypes: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one property type")
    .required(),
  locations: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one location")
    .required(),
  listingIntentions: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one listing intention")
    .required(),
  timeframe: yup.string().required("Timeframe is required"),

  // Goals and Preferences
  primaryGoal: yup.string().required("Primary goal is required"),
  //   monthlyBudget: yup.string().required("Monthly budget is required"),
  //   additionalServices: yup.array().of(yup.string()).required(),

  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),

  // Legal and Verification
  //   hasInsurance: yup.boolean().required(),
  //   hasLicense: yup.boolean().required(),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], "You must agree to the terms")
    .required(),
  agreeToBackground: yup
    .boolean()
    .oneOf([true], "You must agree to background check")
    .required(),
});

type OwnerOnboardingData = yup.InferType<typeof ownerOnboardingSchema>;

const steps = [
  { id: 1, title: "Personal Info", description: "Tell us about yourself" },
  { id: 2, title: "Experience", description: "Your property experience" },
  { id: 3, title: "Properties", description: "What you want to list" },
  { id: 4, title: "Listing Goals", description: "Rent, lease, or sell" },
  { id: 5, title: "Services", description: "Your objectives" },
  { id: 6, title: "Verification", description: "Legal requirements" },
];

const benefits = [
  {
    icon: DollarSign,
    title: "Maximize Revenue",
    description: "Optimize pricing for rentals, leases, and sales",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Protected payments for all transaction types",
  },
  {
    icon: Users,
    title: "Quality Connections",
    description: "Verified renters, lessees, and buyers",
  },
  {
    icon: Zap,
    title: "All-in-One Platform",
    description: "Rent, lease, and sell from one dashboard",
  },
];

const platformFeatures = [
  {
    icon: Home,
    title: "Rental Properties",
    description: "Monthly and yearly rental listings with tenant screening",
    features: [
      // "Tenant background checks",
      // "Automated rent collection",
      // "Lease management",
    ],
  },
  {
    icon: Key,
    title: "Lease Properties",
    description: "Commercial and long-term lease agreements",
    features: [
      // "Commercial lease templates",
      // "Lease negotiation tools",
      // "Corporate tenant verification",
    ],
  },
  {
    icon: FileText,
    title: "Property Sales",
    description: "Sell residential and commercial properties",
    features: [
      // "Market analysis tools",
      // "Buyer pre-qualification",
      // "Transaction management",
    ],
  },
];

export default function OnboardOwnerPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<OwnerOnboardingData>({
    resolver: yupResolver(ownerOnboardingSchema),
    defaultValues: {
      ownerType: "individual",
      experience: "first_time",
      propertiesOwned: 1,
      propertyTypes: [],
      locations: [],
      listingIntentions: [],
      //   additionalServices: [],
      //   hasInsurance: false,
      //   hasLicense: false,
      agreeToTerms: false,
      agreeToBackground: false,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup/owner`,
        payload
      );

      return response.data;
    },
    onSuccess: async (data) => {
      toast(
        "You have successfully signed up, check your email for verification link",
        {
          description: data.message,
        }
      );

      await delay(1000);
      router.push("/signin");
    },
    onError: () => {
      toast.error("There was an error signing up.");
    },
  });

  const watchedOwnerType = watch("ownerType");
  const watchedPropertyTypes = watch("propertyTypes") || [];
  const watchedLocations = watch("locations") || [];
  const watchedListingIntentions = watch("listingIntentions") || [];
  //   const watchedAdditionalServices = watch("additionalServices") || [];

  const progress = (currentStep / steps.length) * 100;

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof OwnerOnboardingData)[] => {
    switch (step) {
      case 1:
        return ["firstName", "lastName", "email", "phone", "ownerType"];

      case 2:
        const baseFields: (keyof OwnerOnboardingData)[] = [
          "experience",
          "propertiesOwned",
        ];

        return baseFields;
      case 3:
        return ["propertyTypes", "locations"];
      case 4:
        return ["listingIntentions", "timeframe"];
      case 5:
        return [
          "primaryGoal",
          //   "monthlyBudget",
          //   "additionalServices"
        ];
      case 6:
        return [
          //   "hasInsurance",
          //   "hasLicense",
          "password",
          "confirmPassword",
          "agreeToTerms",
          "agreeToBackground",
        ];
      default:
        return [];
    }
  };

  const onSubmit = async (data: OwnerOnboardingData) => {
    // console.log(data);
    const { confirmPassword, firstName, lastName, ...rest } = data;
    await mutateAsync({ ...rest, firstname: firstName, lastname: lastName });

    // setIsSubmitting(true);
    // try {
    //   // Simulate API call
    // //   await new Promise((resolve) => setTimeout(resolve, 2000));
    // //   console.log("Owner onboarding data:", data);
    // //   router.push("/dashboard/owner?onboarded=true");
    // await mutateAsync(data)
    // } catch (error) {
    //   console.error("Onboarding failed:", error);
    // } finally {
    // //   setIsSubmitting(false);
    // }
  };

  const handlePropertyTypeToggle = (type: string) => {
    const current = watchedPropertyTypes;
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setValue("propertyTypes", updated);
  };

  const handleLocationToggle = (location: string) => {
    const current = watchedLocations;
    const updated = current.includes(location)
      ? current.filter((l) => l !== location)
      : [...current, location];
    setValue("locations", updated);
  };

  const handleListingIntentionToggle = (intention: string) => {
    const current = watchedListingIntentions;
    const updated = current.includes(intention)
      ? current.filter((i) => i !== intention)
      : [...current, intention];
    setValue("listingIntentions", updated);
  };

  //   const handleAdditionalServiceToggle = (service: string) => {
  //     const current = watchedAdditionalServices;
  //     const updated = current.includes(service)
  //       ? current.filter((s) => s !== service)
  //       : [...current, service];
  //     setValue("additionalServices", updated);
  //   };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">
                Complete Property Platform
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Whether you want to rent, lease, or sell your properties, our
                platform provides everything you need to succeed in today's
                market.
              </p>

              {/* Platform Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {platformFeatures.map((feature, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
                      <benefit.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Get Started</h2>
                <span className="text-sm text-gray-600">
                  Step {currentStep} of {steps.length}
                </span>
              </div>
              <Progress value={progress} className="h-2 mb-4" />
              <div className="flex justify-between">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${
                      step.id <= currentStep ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                        step.id < currentStep
                          ? "bg-blue-600 text-white"
                          : step.id === currentStep
                            ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                            : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {step.id < currentStep ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-medium">{step.title}</div>
                      <div className="text-xs text-gray-500 hidden md:block">
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                  <CardDescription>
                    {steps[currentStep - 1].description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            {...register("firstName")}
                            placeholder="John"
                          />
                          {errors.firstName && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.firstName.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            {...register("lastName")}
                            placeholder="Doe"
                          />
                          {errors.lastName && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              {...register("email")}
                              placeholder="john@example.com"
                              className="pl-10"
                            />
                          </div>
                          {errors.email && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              {...register("phone")}
                              placeholder="(555) 123-4567"
                              className="pl-10"
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label>I am a *</Label>
                        <RadioGroup
                          value={watchedOwnerType}
                          onValueChange={(value) =>
                            setValue("ownerType", value as any)
                          }
                          className="mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="individual"
                              id="individual"
                            />
                            <Label htmlFor="individual">
                              Individual Property Owner
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="company" id="company" />
                            <Label htmlFor="company">Real Estate Company</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="property_manager"
                              id="property_manager"
                            />
                            <Label htmlFor="property_manager">
                              Property Management Company
                            </Label>
                          </div>
                        </RadioGroup>
                        {errors.ownerType && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.ownerType.message}
                          </p>
                        )}
                      </div>
                      {/* 
                      {(watchedOwnerType === "company" ||
                        watchedOwnerType === "property_manager") && (
                        <div>
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            id="companyName"
                            {...register("companyName")}
                            placeholder="ABC Property Management"
                          />
                          {errors.companyName && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.companyName.message}
                            </p>
                          )}
                        </div>
                      )} */}
                    </div>
                  )}

                  {/* Step 2: Experience */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <Label>Property Management Experience *</Label>
                        <RadioGroup
                          value={watch("experience")}
                          onValueChange={(value) =>
                            setValue("experience", value as any)
                          }
                          className="mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="first_time"
                              id="first_time"
                            />
                            <Label htmlFor="first_time">
                              First-time property owner
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="some_experience"
                              id="some_experience"
                            />
                            <Label htmlFor="some_experience">
                              Some experience (1-5 properties)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="experienced"
                              id="experienced"
                            />
                            <Label htmlFor="experienced">
                              Experienced (5+ properties)
                            </Label>
                          </div>
                        </RadioGroup>
                        {errors.experience && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.experience.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="propertiesOwned">
                          How many properties do you currently own? *
                        </Label>
                        <Input
                          id="propertiesOwned"
                          type="number"
                          min="0"
                          {...register("propertiesOwned", {
                            valueAsNumber: true,
                          })}
                          placeholder="1"
                        />
                        {errors.propertiesOwned && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.propertiesOwned.message}
                          </p>
                        )}
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">
                          Platform Success Metrics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span>15% higher rental income on average</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>Properties rent/sell 40% faster</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span>100% verified tenant/buyer screening</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-blue-600" />
                            <span>24/7 customer support</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Property Information */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <Label>
                          What types of properties do you want to list? *
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                          {[
                            "Apartment",
                            "House",
                            "Duplex",
                            "Townhouse",
                            "Studio",
                            "Commercial",
                          ].map((type) => (
                            <div
                              key={type}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                watchedPropertyTypes.includes(type)
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => handlePropertyTypeToggle(type)}
                            >
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  {type}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {errors.propertyTypes && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.propertyTypes.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Where are your properties located? *</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                          {[
                            "Lagos, LG",
                            "Portharcourt, PH",
                            "Abuja, ABJ",
                            "Ibadan, IB",
                            "Kaduna, KD",
                            "Kano, KN",
                            "Other",
                          ].map((location) => (
                            <div
                              key={location}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                watchedLocations.includes(location)
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => handleLocationToggle(location)}
                            >
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  {location}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {errors.locations && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.locations.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Listing Intentions */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <Label>
                          What do you want to do with your properties? *
                        </Label>
                        <p className="text-sm text-gray-600 mb-4">
                          Our platform supports all types of property
                          transactions. Select all that apply:
                        </p>
                        <div className="grid grid-cols-1 gap-4">
                          {[
                            {
                              value: "rent",
                              title: "Rent Properties",
                              description:
                                "Monthly or yearly rental agreements with tenant screening",
                              icon: Home,
                            },
                            {
                              value: "lease",
                              title: "Lease Properties",
                              description:
                                "Long-term commercial or residential lease agreements",
                              icon: Key,
                            },
                            {
                              value: "sell",
                              title: "Sell Properties",
                              description:
                                "List properties for sale with buyer pre-qualification",
                              icon: FileText,
                            },
                          ].map((intention) => (
                            <div
                              key={intention.value}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                watchedListingIntentions.includes(
                                  intention.value
                                )
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() =>
                                handleListingIntentionToggle(intention.value)
                              }
                            >
                              <div className="flex items-start gap-3">
                                <intention.icon className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                  <h3 className="font-medium">
                                    {intention.title}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {intention.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {errors.listingIntentions && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.listingIntentions.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="timeframe">
                          When do you plan to start listing? *
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setValue("timeframe", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your timeframe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediately">
                              Immediately
                            </SelectItem>
                            <SelectItem value="within_month">
                              Within 1 month
                            </SelectItem>
                            <SelectItem value="within_3_months">
                              Within 3 months
                            </SelectItem>
                            <SelectItem value="within_6_months">
                              Within 6 months
                            </SelectItem>
                            <SelectItem value="just_exploring">
                              Just exploring options
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.timeframe && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.timeframe.message}
                          </p>
                        )}
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-900 mb-2">
                          Multi-Purpose Platform Benefits
                        </h3>
                        <div className="space-y-2 text-sm text-green-800">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>
                              Single dashboard for all property types and
                              transaction methods
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>
                              Flexible pricing strategies for rentals, leases,
                              and sales
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>
                              Comprehensive screening for tenants, lessees, and
                              buyers
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>
                              Legal document templates for all transaction types
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Goals and Services */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="primaryGoal">
                          What's your primary goal? *
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setValue("primaryGoal", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your primary goal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="maximize_income">
                              Maximize rental/sale income
                            </SelectItem>
                            <SelectItem value="find_quality_tenants">
                              Find quality tenants/buyers
                            </SelectItem>
                            <SelectItem value="reduce_vacancy">
                              Reduce vacancy/time on market
                            </SelectItem>
                            <SelectItem value="property_management">
                              Simplify property management
                            </SelectItem>
                            <SelectItem value="diversify_portfolio">
                              Diversify property portfolio
                            </SelectItem>
                            <SelectItem value="passive_income">
                              Generate passive income
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.primaryGoal && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.primaryGoal.message}
                          </p>
                        )}
                      </div>

                      {/* <div>
                        <Label htmlFor="monthlyBudget">
                          Monthly marketing budget *
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setValue("monthlyBudget", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-100">$0 - $100</SelectItem>
                            <SelectItem value="100-300">$100 - $300</SelectItem>
                            <SelectItem value="300-500">$300 - $500</SelectItem>
                            <SelectItem value="500-1000">
                              $500 - $1,000
                            </SelectItem>
                            <SelectItem value="1000+">$1,000+</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.monthlyBudget && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.monthlyBudget.message}
                          </p>
                        )}
                      </div> */}

                      {/* <div>
                        <Label>Additional services you're interested in:</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                          {[
                            "Professional photography",
                            "Virtual tours",
                            "Property management",
                            "Legal document assistance",
                            "Market analysis",
                            "Tenant/buyer screening",
                            "Maintenance coordination",
                            "Financial reporting",
                          ].map((service) => (
                            <div
                              key={service}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                watchedAdditionalServices.includes(service)
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() =>
                                handleAdditionalServiceToggle(service)
                              }
                            >
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  {service}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div> */}

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-yellow-900 mb-2">
                          Success Stories
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-yellow-800">
                                "Sold my condo 3 weeks faster and rented my
                                apartment at 20% higher rate!"
                              </p>
                              <p className="text-xs text-yellow-600">
                                - Sarah M., Seattle (Rent & Sale)
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-yellow-800">
                                "Perfect platform for my commercial leases and
                                residential rentals. One dashboard for
                                everything."
                              </p>
                              <p className="text-xs text-yellow-600">
                                - Mike R., Portland (Lease & Rent)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 6: Verification */}
                  {currentStep === 6 && (
                    <div className="space-y-6">
                      {/* <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasInsurance"
                            checked={watch("hasInsurance")}
                            onCheckedChange={(checked) =>
                              setValue("hasInsurance", !!checked)
                            }
                          />
                          <Label htmlFor="hasInsurance">
                            I have property insurance for my properties
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasLicense"
                            checked={watch("hasLicense")}
                            onCheckedChange={(checked) =>
                              setValue("hasLicense", !!checked)
                            }
                          />
                          <Label htmlFor="hasLicense">
                            I have any required business licenses (if
                            applicable)
                          </Label>
                        </div>
                      </div>  */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">Password *</Label>
                          <Input
                            id="password"
                            {...register("password")}
                            placeholder=""
                          />
                          {errors.password && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.password.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="lastName">Confirm Password *</Label>
                          <Input
                            id="confirmPassword"
                            {...register("confirmPassword")}
                            placeholder=""
                          />
                          {errors.confirmPassword && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.confirmPassword.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="agreeToTerms"
                            checked={watch("agreeToTerms")}
                            onCheckedChange={(checked) =>
                              setValue("agreeToTerms", !!checked)
                            }
                          />
                          <Label htmlFor="agreeToTerms" className="text-sm">
                            I agree to the{" "}
                            <a
                              href="/terms"
                              className="text-blue-600 hover:underline"
                            >
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a
                              href="/privacy"
                              className="text-blue-600 hover:underline"
                            >
                              Privacy Policy
                            </a>
                            *
                          </Label>
                        </div>
                        {errors.agreeToTerms && (
                          <p className="text-sm text-red-600">
                            {errors.agreeToTerms.message}
                          </p>
                        )}

                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="agreeToBackground"
                            checked={watch("agreeToBackground")}
                            onCheckedChange={(checked) =>
                              setValue("agreeToBackground", !!checked)
                            }
                          />
                          <Label
                            htmlFor="agreeToBackground"
                            className="text-sm"
                          >
                            I consent to background and identity verification
                            checks *
                          </Label>
                        </div>
                        {errors.agreeToBackground && (
                          <p className="text-sm text-red-600">
                            {errors.agreeToBackground.message}
                          </p>
                        )}
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">
                          Next Steps
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Identity verification (1-2 business days)</li>
                          <li>• Property documentation review</li>
                          <li>• Account activation and welcome call</li>
                          <li>• Access to rent, lease, and sale tools</li>
                          <li>• Start listing your properties!</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Navigation Buttons */}
                <div className="flex justify-between p-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < steps.length ? (
                    <Button type="button" onClick={nextStep}>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Complete Setup
                          <CheckCircle className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
