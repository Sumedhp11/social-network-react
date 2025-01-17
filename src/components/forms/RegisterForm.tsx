import { useState } from "react";
import { Link } from "react-router";
import StepperIndicator from "../ui/stepper";
import { renderStep } from "../ui/RenderSteps";

export interface formdata {
  username?: string;
  email?: string;
  password?: string;
  avatar?: File;
  bio?: string;
}

const RegisterForm = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full p-6 rounded-md shadow-lg space-y-5">
        <StepperIndicator activeStep={activeStep} totalSteps={3} />
        {renderStep(activeStep, setActiveStep)}
        <p className="text-center text-base ">
          <span className="text-white">Already have an Account?</span>
          <Link to={"/login"} className="text-[#189FF2] ml-1">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
