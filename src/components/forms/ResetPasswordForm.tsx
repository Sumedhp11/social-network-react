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
import { Input } from "../ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const ResetPasswordForm = ({
  setOpenDialog,
}: {
  setOpenDialog: (value: boolean) => void;
}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);

  const form = useForm();
  const onSubmit = async (values) => {};
  return (
    <div className="w-full h-full p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    type={"password"}
                    className="placeholder:text-gray-700 bg-white"
                    autoComplete="current_password"
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
              disabled={!form.formState.isDirty || !form.formState.isValid}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
