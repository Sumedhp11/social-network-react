import LoginForm from "@/components/forms/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleOAuthProvider } from "@react-oauth/google";

const Login = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="h-fit w-[90%] md:w-[60%] lg:w-[55%] bg-cardGray">
        <CardHeader>
          <CardTitle className="text-white">Login</CardTitle>
          <CardDescription className="text-white">
            Welcome Back !
          </CardDescription>
        </CardHeader>
        <CardContent className="h-fit">
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID!}>
            <LoginForm />
          </GoogleOAuthProvider>
        </CardContent>
        <CardFooter className="hidden"></CardFooter>
      </Card>
    </div>
  );
};

export default Login;
