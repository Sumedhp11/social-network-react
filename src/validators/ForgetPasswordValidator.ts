import { z } from "zod";

export const forgetPasswordValidator = z.object({
  email: z
    .string({ message: "Email Is Required" })
    .email({ message: "Invalid Email Format" }),
});
