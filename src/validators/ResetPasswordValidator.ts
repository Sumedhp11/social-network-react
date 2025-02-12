import { z } from "zod";

export const resetPasswordValidator = z
  .object({
    new_password: z
      .string({ required_error: "Please enter new password" })
      .min(6, { message: "New password must be at least 6 characters" }),
    confirm_new_password: z.string({
      required_error: "Please confirm new password",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.new_password !== data.confirm_new_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "New password and confirm new password do not match",
        path: ["confirm_new_password"],
      });
    }
  });
