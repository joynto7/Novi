import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
export type ContactValues = z.infer<typeof contactSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  bio: z.string().max(300, "Bio must be under 300 characters").optional(),
});
export type ProfileValues = z.infer<typeof profileSchema>;

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;

export const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters").max(160),
  description: z.string().min(20, "Description must be at least 20 characters"),
  overview: z.string().min(20, "Overview must be at least 20 characters"),
  location: z.string().min(2, "Location is required"),
  venue: z.string().min(2, "Venue is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  featured: z.boolean().optional(),
});
export type EventFormValues = z.infer<typeof eventFormSchema>;
