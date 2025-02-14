import { forgetPasswordValidator } from "@/validators/ForgetPasswordValidator";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendResetPasswordMailAPI } from "@/APIs/authAPIs";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Input } from "../ui/input";

const ForgetPasswordForm = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof forgetPasswordValidator>>({
    resolver: zodResolver(forgetPasswordValidator),
    mode: "onSubmit",
  });
  const { mutate: sendResetPasswordMailMutate, isPending } = useMutation({
    mutationFn: sendResetPasswordMailAPI,
    onSuccess: () => {
      toast.success("Reset Password Mail sent Successfully");
      navigate("/login");
    },
  });

  const onSubmit = (values: z.infer<typeof forgetPasswordValidator>) => {
    sendResetPasswordMailMutate(values.email);
  };
  return (
    <div className="w-full h-full p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Email"
                    {...field}
                    type="email"
                    className="placeholder:text-gray-700 bg-white"
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <Button
              type="submit"
              className="bg-[#189FF2] hover:bg-blue-600 w-full"
              disabled={!form.formState.isDirty || isPending}
            >
              {isPending ? "Sending Reset Password" : "Send Reset Password"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgetPasswordForm;
