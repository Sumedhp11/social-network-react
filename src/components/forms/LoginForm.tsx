import { loginAPI, loginWithGoogleAPI } from "@/APIs/authAPIs";
import { useUserId } from "@/hooks";
import { loginValidator } from "@/validators/loginValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [, setUserId] = useUserId("userId", 0);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginValidator>>({
    resolver: zodResolver(loginValidator),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate: login, isPending: loginPending } = useMutation({
    mutationFn: loginAPI,
    onSuccess: (data) => {
      toast.success(data?.message);
      setUserId(data.data.userId as number);
      navigate("/");
    },
  });

  const {
    mutate: login_with_google,
    isError,
    isPending,
  } = useMutation({
    mutationFn: loginWithGoogleAPI,
    onMutate: () => {
      setGoogleLoading(true);
      toast.loading("Logging in with Google...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success(data?.message);
      setUserId(data.data.userId as number);
      navigate("/");
    },
    onError: (error) => {
      toast.dismiss();
      console.error("Google Login API failed:", error);
      toast.error("Google login failed. Please try again.");
    },
    onSettled: () => {
      setGoogleLoading(false);
    },
  });

  async function onSubmit(values: z.infer<typeof loginValidator>) {
    try {
      login({ username: values.username, password: values.password });
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    login_with_google({
      credentials: credentialResponse,
    });
  };

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Username"
                    {...field}
                    className={`placeholder:text-gray-700 bg-white`}
                    autoComplete="username"
                  />
                </FormControl>
                <FormDescription className="text-white">
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      placeholder="Enter Password"
                      {...field}
                      type={showPassword ? "text" : "password"}
                      className="placeholder:text-gray-700 bg-white"
                      autoComplete="current-password"
                    />
                    {showPassword ? (
                      <EyeOff
                        onClick={() => setShowPassword(false)}
                        className="absolute right-2 top-2 cursor-pointer z-10 transition-all text-black"
                      />
                    ) : (
                      <Eye
                        onClick={() => setShowPassword(true)}
                        className="absolute right-2 top-2 cursor-pointer z-10 transition-all text-black"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-end">
            <Link to={"/forget-password"} className="text-[#189FF2] ">
              Forgot Password?
            </Link>
          </div>
          <div className="space-y-3">
            <Button
              name="submit-login"
              disabled={!form.formState.isValid || isPending || loginPending}
              type="submit"
              className="bg-[#189FF2] hover:bg-blue-600 w-full"
            >
              Login
            </Button>
          </div>
        </form>
      </Form>
      {!googleLoading ? (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID!}>
          <GoogleLogin
            text="continue_with"
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.error("Google login failed");
              toast.error("Google login failed. Please try again.");
            }}
            type="standard"
            theme="outline"
            size="large"
            shape="rectangular"
            logo_alignment="center"
            context="signin"
          />
        </GoogleOAuthProvider>
      ) : (
        <div className="flex justify-center items-center">
          <p className="text-white text-sm">Logging in with Google...</p>
        </div>
      )}
      {isError && (
        <p className="text-red-500 text-sm font-normal text-center mt-2">
          Google login failed. Please try again.
        </p>
      )}
      <p className="text-center text-white text-base">
        <span>New Here?</span>
        <Link to={"/register"} className="text-[#189FF2] ml-1">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
