"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationValidatorStep3 } from "@/validators/registerValidator";
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
import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

interface Step3Data {
  avatar?: File;
  bio?: string;
}

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
  setStepData: (data: Step3Data) => void;
}

export default function Step3({ onNext, onBack, setStepData }: Step3Props) {
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const formStep3 = useForm<Step3Data>({
    resolver: zodResolver(registrationValidatorStep3),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) formStep3.setValue("avatar", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader?.result === null) return;
        setImagePreview(reader.result.toString());
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(undefined);
    }
  };

  const handleSubmit: SubmitHandler<Step3Data> = (data) => {
    setStepData(data);
    onNext();
  };

  return (
    <form onSubmit={formStep3.handleSubmit(handleSubmit)} className="space-y-6">
      <Form {...formStep3}>
        <FormField
          control={formStep3.control}
          name="avatar"
          render={() => (
            <FormItem>
              <FormLabel className="text-white">Avatar (Optional)</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4 text-white ">
                  <Input
                    type="file"
                    onChange={handleImageChange}
                    className="text-black bg-white focus:text-black"
                  />
                  <Avatar>
                    <AvatarImage src={imagePreview} alt="avatar" />
                  </Avatar>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formStep3.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Bio (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter Bio"
                  {...field}
                  className="focus:bg-white focus:text-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button
            onClick={onBack}
            className="bg-white text-black hover:bg-slate-300"
          >
            Previous
          </Button>
          <Button type="submit" className="bg-[#189FF2] hover:bg-blue-600">
            Next
          </Button>
        </div>
      </Form>
    </form>
  );
}
