import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// utils/date.ts
export function formatDateTime(dateString: string) {
  const date = new Date(dateString)

  const optionsDate: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  }

  return {
    date: date.toLocaleDateString(undefined, optionsDate), // e.g. "August 18, 2025"
    time: date.toLocaleTimeString(undefined, optionsTime), // e.g. "03:45 PM"
  }
}

export function timeAgo(dateInput?: string | Date | null) {
  if (!dateInput) return "Unknown time"; // guard against null/undefined

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Invalid date"; // guard against bad strings

  const diff = (Date.now() - date.getTime()) / 1000; // seconds

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (diff < 60) return rtf.format(-Math.floor(diff), "second");
  if (diff < 3600) return rtf.format(-Math.floor(diff / 60), "minute");
  if (diff < 86400) return rtf.format(-Math.floor(diff / 3600), "hour");
  return rtf.format(-Math.floor(diff / 86400), "day");
}

export const getPriceDisplay = (property: any) => {
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

// export function timeAgo(dateString: string) {
//   const date = new Date(dateString);
//   const diff = (Date.now() - date.getTime()) / 1000; // in seconds

//   const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

//   if (diff < 60) return rtf?.format(-Math.floor(diff), "second");
//   if (diff < 3600) return rtf?.format(-Math.floor(diff / 60), "minute");
//   if (diff < 86400) return rtf?.format(-Math.floor(diff / 3600), "hour");
//   return rtf?.format(-Math.floor(diff / 86400), "day");
// }

