import { editUserDataAPI } from "@/APIs/authAPIs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userInterface } from "@/types/types";
import { editProfileSchema } from "@/validators/editUserDataValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const EditProfileForm = ({
  userData,
  setOpenDialog,
}: {
  userData: userInterface;
  setOpenDialog: (value: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    userData.avatarUrl || undefined
  );

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: userData.username,
      email: userData.email,
      avatar: userData.avatarUrl,
      bio: userData.bio,
    },
    mode: "onChange",
  });

  const { isPending, mutate: editUserProfile } = useMutation({
    mutationFn: editUserDataAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-data"] });
      setOpenDialog(false);
    },
  });

  const onSubmit = async (values: z.infer<typeof editProfileSchema>) => {
    if (!values) return;
    const formData = new FormData();

    formData.append("email", values.email || "");
    formData.append("username", values.username || "");
    formData.append("bio", values.bio || "");

    if (values.avatar instanceof File) {
      formData.append("avatar", values.avatar);
    } else if (typeof values.avatar === "string") {
      formData.append("avatar", values.avatar);
    }

    editUserProfile(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    form.setValue("avatar", file, { shouldValidate: true });

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-full p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Avatar</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4 text-black">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleImageChange(e);
                        field.onChange(e.target.files?.[0] || null);
                      }}
                      className="text-black bg-white focus:text-black"
                    />
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={imagePreview} alt="avatar" />
                    </Avatar>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Username"
                    {...field}
                    className="placeholder:text-gray-700 bg-white"
                    autoComplete="username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Email"
                    {...field}
                    className="placeholder:text-gray-700 bg-white"
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Bio</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Bio"
                    {...field}
                    className="placeholder:text-gray-700 bg-white"
                    autoComplete="bio"
                  />
                </FormControl>
                <FormDescription className="text-black">
                  Tell us something about yourself.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <Button
              type="submit"
              className="bg-[#189FF2] hover:bg-blue-600 w-full"
              disabled={
                isPending || !form.formState.isDirty || !form.formState.isValid
              }
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProfileForm;
