import { getUserPostsAPI } from "@/APIs/postAPIs";
import Loader from "@/components/ui/Loader";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../posts/PostCard";
import { PostData } from "@/types/types";
import NoDataFound from "@/components/common/NoDataFound";

const UserProfilePosts = ({ userId }: { userId: number }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["user-posts", userId],
    queryFn: () => getUserPostsAPI({ userId: Number(userId) }),
    enabled: !!userId,
  });
  console.log(data);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-full p-4 space-y-4 border-t">
      {data?.length > 0 ? (
        data.map((post: PostData) => <PostCard post={post} key={post.id} />)
      ) : (
        <div className="h-full flex items-center justify-center">
          <NoDataFound text="No Posts Yet" />
        </div>
      )}

      <div className="pb-4" />
    </div>
  );
};

export default UserProfilePosts;
