import { getRecommendedUsersAPI, sendFriendRequestAPI } from "@/APIs/authAPIs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Hourglass, UserRoundPlus } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import Loader from "../ui/Loader";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";

type RecommendedUserType = {
  id: number;
  username: string;
  avatarUrl: string | null;
  status: "rejected" | "blocked" | "pending" | null;
};

const RecommendationCard = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["recommended-friends"],
    queryFn: getRecommendedUsersAPI,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });

  const { mutate: sendFriendRequestMutation } = useMutation({
    mutationFn: sendFriendRequestAPI,
    onSuccess: () => {
      toast.success("Friend Request Sent Successfully");
      queryClient.invalidateQueries({ queryKey: ["recommended-friends"] }); // Refresh user recommendations
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  function handleSendFriendRequest(friendId: number) {
    sendFriendRequestMutation({ friendId });
  }

  if (isLoading) return <Loader />;

  return (
    <div className="w-full flex justify-center mt-5">
      <Card className="bg-cardGray md:w-[95%] rounded-xl shadow-md border-none">
        <CardContent className="w-full h-full flex flex-col py-6 space-y-4">
          <p className="text-white font-medium">
            Suggested Users ({users?.length ?? 0})
          </p>
          {users?.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No recommendations available
            </p>
          ) : (
            users?.map((user: RecommendedUserType) => (
              <div
                key={user.id}
                className="flex items-center justify-between px-2"
              >
                <Link
                  to={`/profile/${user.id}`}
                  className="p-2 flex items-center gap-4 cursor-pointer"
                >
                  <Avatar className="w-12 h-12 ring-2 ring-white">
                    <AvatarImage
                      src={user.avatarUrl ?? "https://github.com/shadcn.png"}
                      alt={user.username}
                      className="object-cover"
                    />
                  </Avatar>
                  <p className="font-medium text-sm text-white">
                    {user.username}
                  </p>
                </Link>
                <div className="flex items-center">
                  {user.status === "pending" ? (
                    <Hourglass size={25} className="text-gray-400" />
                  ) : (
                    <UserRoundPlus
                      size={25}
                      className="cursor-pointer text-white hover:text-blue-500"
                      onClick={() => handleSendFriendRequest(user.id)}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationCard;
