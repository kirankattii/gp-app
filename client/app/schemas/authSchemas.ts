import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be 6+ chars"),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const forgotSchema = z.object({
  email: z.string().email(),
});

export const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be 6+ chars"),
    confirmPassword: z.string().min(6, "Password must be 6+ chars"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
