import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationValidatorStep2 } from "@/validators/registerValidator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Step2Data {
  password: string;
  confirmPassword: string;
}

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
  setStepData: (data: Step2Data) => void;
}

export default function Step2({ onNext, onBack, setStepData }: Step2Props) {
  const formStep2 = useForm<Step2Data>({
    resolver: zodResolver(registrationValidatorStep2),
    mode: "onChange",
  });

  const handleSubmit: SubmitHandler<Step2Data> = (data) => {
    setStepData(data);
    onNext();
  };

  return (
    <form onSubmit={formStep2.handleSubmit(handleSubmit)} className="space-y-6">
      <Form {...formStep2}>
        <FormField
          control={formStep2.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Password"
                  type="password"
                  {...field}
                  className="focus:bg-white focus:text-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formStep2.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Confirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  {...field}
                  className="focus:bg-white focus:text-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between w-full ">
          <Button
            onClick={onBack}
            className="bg-white text-black hover:bg-slate-300"
          >
            Previous
          </Button>
          <Button
            type="submit"
            disabled={!formStep2.formState.isValid}
            className={`bg-[#189FF2] hover:bg-blue-600 ${
              !formStep2.formState.isValid && "cursor-not-allowed"
            }`}
          >
            Next
          </Button>
        </div>
      </Form>
    </form>
  );
}
