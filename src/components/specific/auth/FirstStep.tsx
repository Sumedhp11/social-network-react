import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationValidatorStep1 } from "@/validators/registerValidator";
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
import clsx from "clsx";
interface Step1Data {
  username: string;
  email: string;
}

interface Step1Props {
  onNext: () => void;
  setStepData: (data: Step1Data) => void;
}
export default function Step1({ onNext, setStepData }: Step1Props) {
  const formStep1 = useForm<Step1Data>({
    resolver: zodResolver(registrationValidatorStep1),
    mode: "onChange",
  });

  const handleSubmit: SubmitHandler<Step1Data> = (data) => {
    setStepData(data);
    onNext();
  };

  return (
    <form onSubmit={formStep1.handleSubmit(handleSubmit)} className="space-y-6">
      <Form {...formStep1}>
        <FormField
          control={formStep1.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Username"
                  {...field}
                  className="focus:bg-white focus:text-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formStep1.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Email"
                  {...field}
                  className="focus:bg-white focus:text-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!formStep1.formState.isValid}
          className={clsx(
            "w-full bg-[#189FF2] hover:bg-blue-700",
            !formStep1.formState.isValid && "cursor-not-allowed"
          )}
        >
          Next
        </Button>
      </Form>
    </form>
  );
}
