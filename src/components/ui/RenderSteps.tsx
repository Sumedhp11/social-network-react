import { useState } from "react";
import Step1 from "@/components/specific/auth/FirstStep";
import { formdata } from "@/components/forms/RegisterForm";
import RenderSummary from "@/components/specific/auth/RenderSummary";
import Step2 from "@/components/specific/auth/SecondStep";
import Step3 from "@/components/specific/auth/ThirdStep";

export const renderStep = (
  activeStep: number,
  setActiveStep: (prev: any) => void
) => {
  const [formData, setFormData] = useState<formdata>({});
  const setStepData = (data: Partial<formdata>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => setActiveStep((prev: number) => prev + 1);
  const handleBack = () => setActiveStep((prev: number) => prev - 1);

  switch (activeStep) {
    case 1:
      return <Step1 onNext={handleNext} setStepData={setStepData} />;
    case 2:
      return (
        <Step2
          onNext={handleNext}
          onBack={handleBack}
          setStepData={setStepData}
        />
      );
    case 3:
      return (
        <Step3
          onNext={handleNext}
          onBack={handleBack}
          setStepData={setStepData}
        />
      );
    case 4:
      return <RenderSummary formData={formData} />;
    default:
      return null;
  }
};
