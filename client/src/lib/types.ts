export type Role = "USER" | "ORGANIZER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  phone?: string | null;
  bio?: string | null;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  _count?: { events: number };
}

export interface EventCard {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  images: string[];
  startDate: string;
  location: string;
  price: number;
  capacity: number;
  seatsBooked: number;
  featured: boolean;
  category: { id: string; name: string; slug: string; icon: string };
  avgRating: number;
  reviewCount: number;
}

export interface ReviewUser {
  id: string;
  name: string;
  avatar?: string | null;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: ReviewUser;
}

export interface EventDetail extends EventCard {
  description: string;
  overview: string;
  venue: string;
  endDate: string;
  videoUrl?: string | null;
  organizer: { id: string; name: string; avatar?: string | null };
  reviews: Review[];
}

export interface Booking {
  id: string;
  quantity: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  event: {
    title: string;
    slug: string;
    startDate: string;
    images: string[];
    location?: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  createdAt: string;
  author: { id: string; name: string; avatar?: string | null };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
  errors?: { field: string; message: string }[];
}

export interface ChartPoint {
  label: string;
  value: number;
}
