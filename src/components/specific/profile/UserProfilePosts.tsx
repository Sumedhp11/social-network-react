import { getUserPostsAPI } from "@/APIs/postAPIs";
import Loader from "@/components/ui/Loader";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../posts/PostCard";
import { PostData } from "@/types/types";
import NoDataFound from "@/components/common/NoDataFound";

const UserProfilePosts = ({ userId }: { userId: number }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["user-posts"],
    queryFn: () => getUserPostsAPI({ userId: Number(userId) }),
    enabled: !!userId,
  });
  console.log(data);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-full px-1 border-t border-white">
      {data.length > 0 ? (
        data.map((post: PostData) => <PostCard post={post} key={post.id} />)
      ) : (
        <NoDataFound text="No Posts Yet" />
      )}
    </div>
  );
};

export default UserProfilePosts;
