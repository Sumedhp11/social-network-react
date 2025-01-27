import { getUserPostsAPI } from "@/APIs/postAPIs";
import Loader from "@/components/ui/Loader";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

const UserProfile = () => {
  const { userId } = useParams();
  if (!userId) return;
  const { data, isLoading } = useQuery({
    queryKey: ["user-posts"],
    queryFn: () => getUserPostsAPI({ userId: Number(userId) }),
  });
  console.log(data);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-full h-full border border-white">UserProfile</div>
  );
};

export default UserProfile;
