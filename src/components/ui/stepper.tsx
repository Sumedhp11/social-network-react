import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import { Check } from "lucide-react";
import { Fragment } from "react";

interface StepperIndicatorProps {
  activeStep: number;
  totalSteps: number;
}

const StepperIndicator = ({
  activeStep,
  totalSteps,
}: StepperIndicatorProps) => {
  return (
    <div className="w-full flex justify-center items-center">
      {[...Array(totalSteps)].map((_, index) => {
        const step = index + 1;
        return (
          <Fragment key={step}>
            <div
              className={clsx(
                "w-10 h-10 flex justify-center items-center border-2 rounded-full text-white",
                step < activeStep && "bg-blue-600",
                step === activeStep && "border-white "
              )}
            >
              {step >= activeStep ? step : <Check className="h-5 w-5" />}
            </div>
            {step !== totalSteps && (
              <Separator
                orientation="horizontal"
                className={clsx(
                  "w-12 lg:w-24 xl:w-32 h-[2px]",
                  step < activeStep && "bg-blue-600"
                )}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default StepperIndicator;
