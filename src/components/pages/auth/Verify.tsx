import VerifyForm from "@/components/forms/VerificationForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Verify = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="max-h-[50%] h-fit w-[90%] md:w-[60%] lg:w-[65%] bg-slate-200">
        <CardHeader>
          <CardTitle>Verify Your Account!</CardTitle>
          <CardDescription>Code will expire in 15 mins</CardDescription>
        </CardHeader>
        <CardContent className="h-full w-full">
          <VerifyForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Verify;
