import RegisterForm from "@/components/forms/RegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Register = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="h-fit w-[90%] md:w-[60%] lg:w-[65%] bg-cardGray">
        <CardHeader>
          <CardTitle className="text-white">Register</CardTitle>
          <CardDescription className="text-white">
            Welcome To Social Network!
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full w-full">
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
