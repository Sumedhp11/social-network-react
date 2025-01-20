import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Hourglass, Search, UserRoundPlus } from "lucide-react";
import { getUsersAPI, sendFriendRequestAPI } from "@/APIs/authAPIs";
import Loader from "../ui/Loader";
import { Link } from "react-router";
import { userInterface } from "@/types/types";
import { Avatar, AvatarImage } from "../ui/avatar";
import toast from "react-hot-toast";

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search-term", debouncedSearchTerm],
    queryFn: () => getUsersAPI({ searchTerm: debouncedSearchTerm }),
    enabled: !!debouncedSearchTerm,
  });

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  const { mutate: sendFriendRequestMutation } = useMutation({
    mutationFn: sendFriendRequestAPI,
    onSuccess: () => {
      toast.success("Friend Request Sent Successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["search-term"] });
      setSearchTerm("");
    },
  });
  function handleSendFriendRequest(friendId: number) {
    sendFriendRequestMutation({ friendId });
  }
  return (
    <div className="relative w-96">
      <Input
        placeholder="Search"
        className={`pr-10 text-black placeholder:text-white border border-gray-400 outline-none focus:bg-white focus:border-gray-400 focus:outline-none bg-cardGray ${
          searchTerm && "bg-white"
        }`}
        onChange={handleSearch}
        value={searchTerm}
      />
      <Search
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700"
        size={20}
      />
      {isLoading && <Loader />}
      {isError && <p>Error fetching users.</p>}
      {data && data.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded">
          {data.map((user: userInterface) => (
            <div
              key={user.id}
              className="flex items-center justify-between px-2"
            >
              <Link
                to={`/user/${user.id}`}
                className="p-2 flex items-center gap-4 cursor-pointer"
                onClick={() => setSearchTerm("")}
              >
                <Avatar className="w-12 h-12 ring-2 ring-white">
                  <AvatarImage
                    src={
                      user.avatarUrl === "NULL"
                        ? "https://github.com/shadcn.png"
                        : user.avatarUrl
                    }
                    alt="User Avatar"
                    className="object-contain"
                  />
                </Avatar>
                <p className="font-medium text-sm text-black">
                  {user.username}
                </p>
              </Link>
              <div className="flex items-center">
                {user.friendshipStatus === "none" ? (
                  <UserRoundPlus
                    size={25}
                    className="cursor-pointer text-black"
                    onClick={() => handleSendFriendRequest(user.id)}
                  />
                ) : user.friendshipStatus === "pending" ? (
                  <Hourglass size={25} className="text-black" />
                ) : null}
              </div>
            </div>
          ))}
        </ul>
      )}
      {data && data.length === 0 && (
        <p className="absolute bg-white border border-gray-300 w-full mt-1 rounded">
          No users found.
        </p>
      )}
    </div>
  );
};

export default SearchBox;
