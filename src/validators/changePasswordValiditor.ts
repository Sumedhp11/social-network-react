import { z } from "zod";

export const changePasswordValidator = z
  .object({
    isGoogleSignedIn: z.boolean(),
    current_password: z
      .string({ required_error: "Please enter current password" })
      .min(6, { message: "Current password must be at least 6 characters" })
      .optional(),
    new_password: z
      .string({ required_error: "Please enter new password" })
      .min(6, { message: "New password must be at least 6 characters" }),
    confirm_new_password: z.string({
      required_error: "Please confirm new password",
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.isGoogleSignedIn) {
      if (!data.current_password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Current password is required",
          path: ["current_password"],
        });
      } else if (data.current_password === data.new_password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "New password must be different from current password",
          path: ["new_password"],
        });
      }
    }

    if (data.new_password !== data.confirm_new_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "New password and confirm new password do not match",
        path: ["confirm_new_password"],
      });
    }
  });
