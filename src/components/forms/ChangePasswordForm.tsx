import { changePasswordAPI, sendResetPasswordMailAPI } from "@/APIs/authAPIs";
import { userInterface } from "@/types/types";
import { changePasswordValidator } from "@/validators/changePasswordValiditor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Loader from "../ui/Loader";

const ChangePasswordForm = ({
  userData,
  setOpenDialog,
}: {
  userData: userInterface;
  setOpenDialog: (value: boolean) => void;
}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { mutate: changePasswordMutate, isPending } = useMutation({
    mutationFn: changePasswordAPI,
    onSuccess: (data) => {
      toast.success(data.message);
      setOpenDialog(false);
    },
  });
  const { mutate: sendResetPasswordMailMutate, isPending: resetPwPending } =
    useMutation({
      mutationFn: sendResetPasswordMailAPI,
      onSuccess: () => {
        toast.success("Reset Password Mail sent Successfully");
        setOpenDialog(false);
      },
    });

  const form = useForm<z.infer<typeof changePasswordValidator>>({
    resolver: zodResolver(changePasswordValidator),
    mode: "onChange",
  });
  const isGoogle = form.watch("isGoogleSignedIn");
  const onSubmit = (values: z.infer<typeof changePasswordValidator>) => {
    changePasswordMutate({
      isGoogleSignedIn: values.isGoogleSignedIn,
      current_password: values.current_password,
      new_password: values.new_password,
    });
  };

  return (
    <div className="w-full h-full p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="isGoogleSignedIn"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    className="bg-white"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormLabel className="text-black">
                  Is Google Logged In
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Current Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Current Password"
                    {...field}
                    type="password"
                    className="placeholder:text-gray-700 bg-white"
                    autoComplete="current-password"
                    disabled={isGoogle}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">New Password</FormLabel>
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
                <FormLabel className="text-black">
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
          <div className="w-full flex justify-start gap-3">
            <p
              className="text-sm font-medium text-blue-500 cursor-pointer"
              onClick={() => sendResetPasswordMailMutate(userData.email!)}
            >
              Forget Password?
            </p>
            {resetPwPending ? <Loader className="text-black" /> : null}
          </div>
          <div className="space-y-3">
            <Button
              type="submit"
              className="bg-[#189FF2] hover:bg-blue-600 w-full"
              disabled={!form.formState.isDirty || isPending}
            >
              {isPending ? "Changing Password" : "Change Password"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
