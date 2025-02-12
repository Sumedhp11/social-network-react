import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "react-router";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  if (!token)
    return (
      <div className="w-full h-dvh md:h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-black">
          🚫 Not Allowed To Visit Page
        </p>
      </div>
    );

  return (
    <div className="w-full h-dvh md:h-screen bg-bgGray flex justify-center items-center">
      <Card className="h-fit w-[90%] md:w-[60%] lg:w-[35%] bg-cardGray">
        <CardHeader>
          <CardTitle className="text-white">Reset Password</CardTitle>
          <CardDescription className="hidden"></CardDescription>
        </CardHeader>
        <CardContent className="h-fit">
          <ResetPasswordForm token={token!} />
        </CardContent>
        <CardFooter className="hidden"></CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
