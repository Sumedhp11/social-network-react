import { getFriendsAPI, unFriendAPI } from "@/APIs/authAPIs";
import Loader from "@/components/ui/Loader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUserId } from "@/hooks";
import { userInterface } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserRoundMinus } from "lucide-react";
import { Link } from "react-router";

const UserFriends = ({ user_id }: { user_id: number }) => {
  const [userId] = useUserId("userId", 0);
  const queryClient = useQueryClient();

  const { data: friendsList = [], isLoading } = useQuery({
    queryKey: ["friends", user_id],
    queryFn: () => getFriendsAPI(undefined, user_id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });

  const { isPending, mutate: unfriendMutate } = useMutation({
    mutationFn: unFriendAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", user_id] });
    },
  });

  return (
    <div className="py-3 flex flex-col w-full">
      {isLoading ? (
        <Loader className="text-white" />
      ) : (
        <div className="space-y-5">
          {friendsList.length > 0 ? (
            friendsList.map((i: userInterface, index: number) => (
              <div
                key={i.friendId}
                className={`pb-3 flex justify-between ${
                  index !== friendsList.length - 1
                    ? "border-b border-gray-600"
                    : ""
                }`}
              >
                <Link
                  to={`/profile/${i.friendId}`}
                  className="p-2 flex items-center gap-8 cursor-pointer"
                >
                  <Avatar className="w-14 h-14">
                    <AvatarImage
                      src={i.avatarUrl ?? "https://github.com/shadcn.png"}
                      alt={i.username}
                      className="object-cover"
                    />
                  </Avatar>
                  <p className="font-medium text-sm text-white">{i.username}</p>
                </Link>

                {Number(userId) === Number(user_id) && i.friendshipId ? (
                  isPending ? (
                    <Loader className="text-white" />
                  ) : (
                    <UserRoundMinus
                      onClick={() => unfriendMutate(i.friendshipId!)}
                      className="cursor-pointer text-white hover:text-blue-500"
                      size={25}
                    />
                  )
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-white text-center">No friends found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserFriends;
