import Cookies from 'js-cookie'
import axios from 'axios';



// API client functions for frontend
// export interface Property {
//   id: number
//   title: string
//   price: number
//   location: string
//   fullAddress?: string
//   bedrooms: number
//   bathrooms: number
//   sqft: number
//   rating: number
//   reviews: number
//   images: string[]
//   floorPlan?: string
//   virtualTour?: string
//   description?: string
  // listingType: "sale" | "rent" | "lease"
  // salePrice?: number
  // monthlyRent?: number
  // yearlyRent?: number
  // rentPeriod?: "monthly" | "yearly"
  // leaseAmount?: number
  // leaseDuration?: string
//   owner: {
//     name: string
//     rating: number
//     reviewCount: number
//     responseTime: string
//     responseRate: string
//     joinedDate: string
//     avatar: string
//     verified: boolean
//     bio?: string
//   }
//   amenities: Array<{
//     name: string
//     icon: string
//     category: string
//   }>
//   policies?: {
//     checkIn: string
//     checkOut: string
//     minimumStay: string
//     deposit: string
//     petDeposit: string
//     smokingAllowed: boolean
//     petsAllowed: boolean
//     maxOccupancy: number
//   }
//   neighborhood?: {
//     walkScore: number
//     transitScore: number
//     bikeScore: number
//     nearby: Array<{
//       name: string
//       type: string
//       distance: string
//       icon: any
//     }>
//   }
//   propertyReviews?: Array<{
//     id: number
//     author: string
//     rating: number
//     date: string
//     comment: string
//     avatar: string
//   }>
//   similarProperties?: Array<{
//     id: number
//     title: string
//     price: number
//     location: string
//     image: string
//     bedrooms: number
//     bathrooms: number
//     rating: number
//   }>
//   isDirectOwner: boolean
//   featured: boolean
//   createdAt?: string
//   updatedAt?: string
// }

export type Property = {
  id: string;
  ownerId: string;
  title: string;
  description?: string | null;
  price: number; // Decimal in Prisma is typically represented as number or string in TS depending on your decimal.js setup
  currency?: string | null;
  trending?: boolean | null;
  featured?: boolean | null;
  // status: PropertyStatus;
  propertyType?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqft?: number | null; // Same note as 'price'
  city?: string | null;
  state?: string | null;
  country?: string | null;
  address?: string | null;
  isActive: boolean;
  owner: any;
  images: any[];
};

//  {
//     id: 1,
//     title: "Modern Downtown Loft with City Views",
//     price: 2400,
//     location: "Downtown, City Center",
//     fullAddress: "123 Main Street, Downtown, City Center, 12345",
//     bedrooms: 2,
//     bathrooms: 2,
//     sqft: 1200,
//     rating: 4.8,
//     reviews: 24,
//     images: [
//       "/placeholder.svg?height=600&width=800&text=Living+Room",
//       "/placeholder.svg?height=600&width=800&text=Kitchen",
//       "/placeholder.svg?height=600&width=800&text=Bedroom+1",
//       "/placeholder.svg?height=600&width=800&text=Bedroom+2",
//     ],
//     floorPlan: "/placeholder.svg?height=400&width=600&text=Floor+Plan",
//     virtualTour: "https://example.com/virtual-tour",
//     description: `Experience luxury living in this stunning 2-bedroom, 2-bathroom loft located in the heart of downtown. This modern unit features floor-to-ceiling windows with breathtaking city views, hardwood floors throughout, and an open-concept design perfect for entertaining.`,
//     owner: {
//       name: "Sarah Johnson",
//       rating: 4.9,
//       reviewCount: 47,
//       responseTime: "within an hour",
//       responseRate: "100%",
//       joinedDate: "2019",
//       avatar: "/placeholder.svg?height=100&width=100&text=SJ",
//       verified: true,
//       bio: "I'm a local property owner who takes pride in providing quality housing.",
//     },
//     amenities: [
//       { name: "High-Speed WiFi", icon: "wifi", category: "Internet" },
//       { name: "Parking Included", icon: "parking", category: "Parking" },
//       { name: "Fitness Center", icon: "gym", category: "Building" },
//       { name: "Swimming Pool", icon: "pool", category: "Building" },
//     ],
//     policies: {
//       checkIn: "3:00 PM",
//       checkOut: "11:00 AM",
//       minimumStay: "12 months",
//       deposit: "$2,400",
//       petDeposit: "$500",
//       smokingAllowed: false,
//       petsAllowed: true,
//       maxOccupancy: 4,
//     },
//     neighborhood: {
//       walkScore: 95,
//       transitScore: 88,
//       bikeScore: 82,
//       nearby: [
//         { name: "Starbucks", type: "coffee", distance: "2 min walk", icon: "Coffee" },
//         { name: "Whole Foods", type: "grocery", distance: "5 min walk", icon: "ShoppingBag" },
//       ],
//     },
//     propertyReviews: [
//       {
//         id: 1,
//         author: "Mike Chen",
//         rating: 5,
//         date: "2 weeks ago",
//         comment: "Amazing apartment with incredible views!",
//         avatar: "/placeholder.svg?height=40&width=40&text=MC",
//       },
//     ],
//     isDirectOwner: true,
//     featured: true,
//   },


export interface PropertyFilters {
  search?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: string
  amenities?: string[]
  sortBy?: string
  page?: number
  limit?: number
}

export interface PropertiesResponse {
  properties: Property[]
  total: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface InquiryData {
  propertyId: string
  name: string
  email: string
  phone?: string
  message?: string
  moveInDate?: string
}

export interface ApiError {
  error: string
}

// Base API URL - in production this would be your actual API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export const api = {
  // Fetch properties with filters
  getProperties: async (filters: PropertyFilters = {}): Promise<PropertiesResponse> => {
    const searchParams = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          searchParams.set(key, value.join(","))
        } else {
          searchParams.set(key, value.toString())
        }
      }
    })

    const response = await fetch(`${API_BASE_URL}/property?${searchParams}`)
    //  const response = await fetch(`${API_BASE_URL}/property`)


    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to fetch properties")
    }

    return response.json()
  },

  getAllProperties: async (filters: PropertyFilters = {}): Promise<PropertiesResponse> => {
    const searchParams = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          searchParams.set(key, value.join(","))
        } else {
          searchParams.set(key, value.toString())
        }
      }
    })

    const response = await fetch(`${API_BASE_URL}/property/admin?${searchParams}`,{
       headers:{
        authorization:`Bearer ${Cookies.get('token')}`
      }
    })
    //  const response = await fetch(`${API_BASE_URL}/property`)


    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to fetch properties")
    }

    return response.json()
  },

   getOwnerProperties: async (): Promise<PropertiesResponse> => {
    

    const response = await fetch(`${API_BASE_URL}/property/owner`,{
         headers: {
        "Content-Type": "application/json",
        authorization:`Bearer ${Cookies.get('token')}`

      },
    })
    //  const response = await fetch(`${API_BASE_URL}/property`)


    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to fetch properties")
    }

    return response.json()
  },

  // Fetch single property
  getProperty: async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/property/${id}`)

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to fetch property")
    }

    return response.json()
  },

  // Submit inquiry
  submitInquiry: async (data: InquiryData): Promise<{ success: boolean; message: string; inquiryId: number }> => {
    const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to send inquiry")
    }

    return response.json()
  },

  // Toggle favorite
  toggleFavorite: async (
    propertyId: string,
    userId?: string,
  ): Promise<{ success: boolean; isFavorite: boolean; message: string } | any> => {
    const response = await fetch(`${API_BASE_URL}/property/${propertyId}/favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization:`Bearer ${Cookies.get('token')}`

      },
      body: JSON.stringify({  }),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to update favorites")
    }

    return response.json()
  },

    schedulePropertyView: async (data:
   {
          propertyId:string;
          scheduledAt:string;
          notes: string;
        }
  ): Promise<{ success: boolean; isFavorite: boolean; message: string } | any> => {
    const response = await fetch(`${API_BASE_URL}/property/${data.propertyId}/viewing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization:`Bearer ${Cookies.get('token')}`

      },
      body: JSON.stringify({scheduledAt:data.scheduledAt,notes:data.notes  }),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to schedule viewing")
    }

    return response.json()
  },

  // Get user favorites
  getFavorites: async (userId?: string): Promise<{ favorites: number[]; count: number } | any> => {
    const searchParams = new URLSearchParams()
    if (userId) {
      searchParams.set("userId", userId)
    }

    const response = await fetch(`${API_BASE_URL}/property/favorites?${searchParams}`,{
      headers:{
        authorization:`Bearer ${Cookies.get('token')}`
      }
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to fetch favorites")
    }

    return response.json()
  },

    getViewings: async (): Promise< any> => {
 
    const response = await fetch(`${API_BASE_URL}/property/viewings`,{
      headers:{
        authorization:`Bearer ${Cookies.get('token')}`
      }
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to fetch scheduled viewings")
    }

    return response.json()
  },


    getOwnerViewings: async (): Promise< any> => {
 
    const response = await fetch(`${API_BASE_URL}/property/viewings/owner`,{
      headers:{
        authorization:`Bearer ${Cookies.get('token')}`
      }
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to fetch scheduled viewings")
    }

    return response.json()
  },

  getUserProfile: async (): Promise<any> => {

    const response = await fetch(`${API_BASE_URL}/auth/profile`,{
      headers:{
        authorization:`Bearer ${Cookies.get('token')}`
      }
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to fetch user profile")
    }

    return response.json()
  },
    getUserStats: async (): Promise<any> => {

    const response = await fetch(`${API_BASE_URL}/user/stats`,{
      headers:{
        authorization:`Bearer ${Cookies.get('token')}`
      }
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to fetch user stats")
    }

    return response.json()
  },

 trackPropertyView : async (propertyId: string) => {
   const response = await fetch(`${API_BASE_URL}/property/${propertyId}/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization:`Bearer ${Cookies.get('token')}`

      },
      body: JSON.stringify({ }),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to track view")
    }

    return response.json()
  // return axios.post(`/api/property/${propertyId}/view`)
},

getPropertyViews: async (propertyId: string) => {
     const response = await fetch(`${API_BASE_URL}/property/${propertyId}/views`,{
      headers:{
        authorization:`Bearer ${Cookies.get('token')}`
      }
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to fetch property views")
    }

    return response.json()
},

getOwnerPropertiesViews: async () => {
      const response = await fetch(`${API_BASE_URL}/property/owner/views`,{
      headers:{
        authorization:`Bearer ${Cookies.get('token')}`
      }
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to fetch owner properties views")
    }

    return response.json()
 
},

getAllPropertiesViews: async () => {

        const response = await fetch(`${API_BASE_URL}/property/views`,{
      headers:{
        authorization:`Bearer ${Cookies.get('token')}`
      }
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to fetch properties views")
    }

    return response.json()
  
  // const res = await axios.get(`/api/property/views`)
  // return res.data
},

getUserPropertiesViews: async () => {

        const response = await fetch(`${API_BASE_URL}/property/user/views`,{
      headers:{
        authorization:`Bearer ${Cookies.get('token')}`
      }
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to fetch properties views")
    }

    return response.json()
  

},

sendMessage : async (propertyId: string, userId:string) => {
   const response = await fetch(`${API_BASE_URL}/chat/property/${propertyId}/conversation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization:`Bearer ${Cookies.get('token')}`

      },
      body: JSON.stringify({ }),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to start conversation")
    }

    return response.json()
  // return axios.post(`/api/property/${propertyId}/view`)
},

fetchChats:    async function () {

     const response = await fetch(`${API_BASE_URL}/chat`, {
      headers: {
        "Content-Type": "application/json",
        authorization:`Bearer ${Cookies.get('token')}`

      }    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to fetch chats")
    }

    return response.json()
    
},

getRecentActivities: async (): Promise<any> => {

    const response = await fetch(`${API_BASE_URL}/user/activities`,{
      headers:{
        authorization:`Bearer ${Cookies.get('token')}`
      }
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to fetch recent activities")
    }

    return response.json()
  },

getUsers: async (filters: any = {}): Promise<any> => {
    const searchParams = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          searchParams.set(key, value.join(","))
        } else {
          searchParams.set(key, value.toString())
        }
      }
    })

    const response = await fetch(`${API_BASE_URL}/user?${searchParams}`)

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || "Failed to fetch users")
    }

    return response.json()
  },

deleteProperty: async function (id: string) {
  const res = await fetch(`${API_BASE_URL}/property/${id}`, {
    method: "DELETE",
    headers:{
        authorization:`Bearer ${Cookies.get('token')}`
      }
  });

  if (!res.ok) {
    throw new Error("Failed to delete property");
  }
  return res.json();
},

fetchReviews : async (propertyId: string) => {
  const { data } = await axios.get(`${API_BASE_URL}/property/${propertyId}/reviews`,{
      headers:{
        authorization:`Bearer ${Cookies.get('token')}`
      }
    });
  return data;
},

addReview : async (propertyId: string, content: string) => {
  const { data } = await axios.post(`${API_BASE_URL}/property/${propertyId}/reviews`, { content },{
      headers:{
        authorization:`Bearer ${Cookies.get('token')}`
      }
    });
  return data;
},

fetchAverageRating : async (propertyId: string) => {
  const { data } = await axios.get(`${API_BASE_URL}/property/${propertyId}/ratings/average`,{
      headers:{
        authorization:`Bearer ${Cookies.get('token')}`
      }
    });
  return data;
},

addRating : async (propertyId: string, value: number) => {
  const { data } = await axios.post(`${API_BASE_URL}/property/${propertyId}/ratings`, { value },{
      headers:{
        authorization:`Bearer ${Cookies.get('token')}`
      }
    });
  return data;
},

}
