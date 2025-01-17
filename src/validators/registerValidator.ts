import { z } from "zod";

export const registrationValidatorStep1 = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});
export const registrationValidatorStep2 = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });
export const registrationValidatorStep3 = z.object({
  avatar: z.instanceof(File).optional(),
  bio: z.string().max(150, "Bio must be under 150 characters").optional(),
});
