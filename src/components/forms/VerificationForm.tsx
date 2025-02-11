import { verifyUserAPI } from "@/APIs/authAPIs";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const VerifyForm = () => {
  const [value, setValue] = useState<string>("");
  const otpToken = sessionStorage.getItem("otp-token");
  const navigate = useNavigate();
  const { mutate: VerifyUser, isPending } = useMutation({
    mutationFn: verifyUserAPI,
    onSuccess: (data) => {
      toast.success(data.message, {
        position: "bottom-center",
      });
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast.error(error.message, { position: "top-right" });
    },
  });
  const handleVerification = () => {
    VerifyUser({ verification_code: value, otpToken: otpToken! });
  };
  return (
    <div className="w-full flex flex-col justify-center items-center space-y-8">
      <InputOTP
        maxLength={5}
        pattern={REGEXP_ONLY_DIGITS}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} aria-label="Enter first digit" />
          <InputOTPSeparator />
          <InputOTPSlot index={1} />
          <InputOTPSeparator />
          <InputOTPSlot index={2} />
          <InputOTPSeparator />

          <InputOTPSlot index={3} />
          <InputOTPSeparator />
          <InputOTPSlot index={4} />
        </InputOTPGroup>
      </InputOTP>
      <Button
        className="w-full bg-[#189FF2] hover:bg-blue-600"
        disabled={isPending || value.length < 5}
        onClick={handleVerification}
      >
        {isPending ? "Verifying" : "Verify"}
      </Button>
    </div>
  );
};

export default VerifyForm;
