import { z } from "zod";

export const roleSchema = z.enum(["admin", "user"]);

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must consist of at least 3 characters")
    .max(30, "Username can max contain 30 characters"),
  email: z.string().email("Invalid mail"),
  password: z.string().min(8, "Password must consist of at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid mail"),
  password: z.string().min(1, "Password is required"),
});
