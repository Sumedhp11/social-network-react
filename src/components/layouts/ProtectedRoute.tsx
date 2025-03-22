import { validateAccessToken } from "@/APIs/authAPIs";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import SocialLoader from "../ui/InitialLoader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: validateAccessToken,
    retry: false,
    onError: () => navigate("/login", { replace: true }),
  });
  useEffect(() => {
    mutate();
  }, [mutate]);
  if (isPending) {
    return <SocialLoader />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
