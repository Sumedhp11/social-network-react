import { validateAccessToken } from "@/APIs/authAPIs";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Loader from "../ui/Loader";

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
    return <Loader />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
