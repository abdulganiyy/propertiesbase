import * as yup from "yup";

const propertyImageSchema = yup.object().shape({
  id: yup.string().uuid().optional(),
  propertyId: yup.string().uuid().optional(),
  imageUrl: yup.string().url().required(),
  isCover: yup.boolean().default(false),
  filename: yup.string().optional(),
});

export const propertySchema = yup.object({
  id: yup.string().uuid().optional(),
  title: yup
    .string()
    .required("Property title is required")
    .min(10, "Title must be at least 10 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(50, "Description must be at least 50 characters"),
  propertyType: yup.string().required("Property type is required"),
  listingType: yup
    .string()
    .required("Listing type is required")
    .oneOf(["sale", "rent", "lease"], "Invalid listing type"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  //   zipCode: yup
  //     .string()
  //     .required("ZIP code is required")
  //     .matches(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  bedrooms: yup.string().optional(),
  bathrooms: yup.string().optional(),
  sqft: yup
    .number()
    .required("Square footage is required")
    .positive("Must be a positive number"),
  salePrice: yup.number().when("listingType", {
    is: "sale",
    then: (schema) =>
      schema
        .required("Sale price is required")
        .positive("Must be a positive number"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // monthlyRent: yup.number().when("listingType", {
  //   is: "rent",
  //   then: (schema) =>
  //     schema
  //       .required("Monthly rent is required")
  //       .positive("Must be a positive number"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),

  // yearlyRent: yup.number().when("listingType", {
  //   is: "rent",
  //   then: (schema) => schema.positive("Must be a positive number"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  monthlyRent: yup.number().when(["listingType", "rentPeriod"], {
    is: (listingType: string, rentPeriod: string) =>
      listingType === "rent" && rentPeriod === "monthly",
    then: (schema) =>
      schema
        .positive("Must be a positive number")
        .required("Monthly rent is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  yearlyRent: yup.number().when(["listingType", "rentPeriod"], {
    is: (listingType: string, rentPeriod: string) =>
      listingType === "rent" && rentPeriod === "yearly",
    then: (schema) =>
      schema
        .positive("Must be a positive number")
        .required("Yearly rent is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  rentPeriod: yup.string().when("listingType", {
    is: "rent",
    then: (schema) =>
      schema
        .required("Rent period is required")
        .oneOf(["monthly", "yearly"], "Invalid rent period"),
    otherwise: (schema) => schema.notRequired(),
  }),

  leaseAmount: yup.number().when("listingType", {
    is: "lease",
    then: (schema) =>
      schema
        .required("Lease amount is required")
        .positive("Must be a positive number"),
    otherwise: (schema) => schema.notRequired(),
  }),

  leaseDuration: yup.string().when("listingType", {
    is: "lease",
    then: (schema) => schema.required("Lease duration is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  securityDeposit: yup.number().when("listingType", {
    is: (val: string) => val === "rent" || val === "lease",
    then: (schema) =>
      schema
        .required("Security deposit is required")
        .min(0, "Must be 0 or greater"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // leaseTerm: yup.string().when("listingType", {
  //   is: "lease",
  //   then: (schema) => schema.required("Lease term is required"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  availableDate: yup
    .date()
    .required("Available date is required")
    .min(new Date(), "Date must be in the future"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^\+?[\d\s\-$$$$]+$/, "Invalid phone number"),
  images: yup
    .array()
    .of(propertyImageSchema)
    .required("Property images are required")
    .min(4, "Atleast four Property images are required"),
  amenities: yup.array().of(yup.string()).optional(),
});

export const inquirySchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().matches(/^\+?[\d\s\-$$$$]+$/, "Invalid phone number"),
  message: yup
    .string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters"),
  moveInDate: yup.date().min(new Date(), "Move-in date must be in the future"),
});

export const profileSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().matches(/^\+?[\d\s\-$$$$]+$/, "Invalid phone number"),
  bio: yup.string().max(500, "Bio must be less than 500 characters"),
});

export const searchPreferencesSchema = yup.object({
  minPrice: yup.number().min(0, "Must be 0 or greater"),
  maxPrice: yup.number().min(0, "Must be 0 or greater"),
  bedrooms: yup.string(),
  propertyTypes: yup.array().of(yup.string()),
  amenities: yup.array().of(yup.string()),
  locations: yup.array().of(yup.string()),
});

export type PropertyFormData = yup.InferType<typeof propertySchema>;
export type InquiryFormData = yup.InferType<typeof inquirySchema>;
export type ProfileFormData = yup.InferType<typeof profileSchema>;
export type SearchPreferencesFormData = yup.InferType<
  typeof searchPreferencesSchema
>;
