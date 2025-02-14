import ForgetPasswordForm from "@/components/forms/ForgetPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ForgetPassword = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="h-fit w-[90%] md:w-[60%] lg:w-[55%] bg-cardGray">
        <CardHeader>
          <CardTitle className="text-white">Forget Password</CardTitle>
          <CardDescription className="hidden"></CardDescription>
        </CardHeader>
        <CardContent className="h-fit">
          <ForgetPasswordForm />
        </CardContent>
        <CardFooter className="hidden"></CardFooter>
      </Card>
    </div>
  );
};

export default ForgetPassword;
