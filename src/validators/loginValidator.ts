import { z } from "zod";

export const loginValidator = z.object({
  username: z
    .string({ message: "Please Enter username" })
    .min(3, { message: "Username is Required" }),
  password: z
    .string({ message: "Please Enter Password" })
    .min(6, { message: "Password should be atleast 6 characters" }),
});
