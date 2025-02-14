import { resetPasswordAPI } from "@/APIs/authAPIs";
import { resetPasswordValidator } from "@/validators/ResetPasswordValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useNavigate } from "react-router";

const ResetPasswordForm = ({ token }: { token: string }) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const { mutate: resetPasswordMutate, isPending } = useMutation({
    mutationFn: resetPasswordAPI,
    onSuccess: (message) => {
      toast.success(message);
        navigate("/", {
          replace: true,
        });
    },
    onError: (error) => {
      toast.error(error.message);
        navigate("/", { replace: true });
    },
  });

  const form = useForm<z.infer<typeof resetPasswordValidator>>({
    resolver: zodResolver(resetPasswordValidator),
    mode: "onSubmit",
  });

  const onSubmit = (values: z.infer<typeof resetPasswordValidator>) => {
    resetPasswordMutate({
      new_password: values.new_password,
      otpToken: token!,
    });
  };

  return (
    <div className="w-full h-full p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">New Password</FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      placeholder="Enter New Password"
                      {...field}
                      type={showNewPassword ? "text" : "password"}
                      className="placeholder:text-gray-700 bg-white"
                      autoComplete="new-password"
                    />
                    {showNewPassword ? (
                      <EyeOff
                        onClick={() => setShowNewPassword(false)}
                        className="absolute right-2 top-2 cursor-pointer z-10 transition-all text-black"
                      />
                    ) : (
                      <Eye
                        onClick={() => setShowNewPassword(true)}
                        className="absolute right-2 top-2 cursor-pointer z-10 transition-all text-black"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm New Password"
                    {...field}
                    type={showNewPassword ? "text" : "password"}
                    className="placeholder:text-gray-700 bg-white"
                    autoComplete="new-password"
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
              {isPending ? "Resetting Password" : "Reset Password"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
