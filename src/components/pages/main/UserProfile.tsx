import UserCard from "@/components/specific/profile/UserCard";
import UserFriends from "@/components/specific/profile/UserFriends";
import UserProfilePosts from "@/components/specific/profile/UserProfilePosts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useParams } from "react-router";

const UserProfile = () => {
  const [tabOption, setTabOption] = useState<"posts" | "friends">("posts");
  const { userId } = useParams<{ userId: string }>();
  const parsedUserId = parseInt(userId || "", 10);

  return (
    <div className="w-full h-[90vh] flex flex-col">
      {isNaN(parsedUserId) ? (
        <p className="text-red-500 p-4">User ID Not Provided</p>
      ) : (
        <>
          <div className="flex-none">
            <UserCard userId={parsedUserId} />
          </div>

          <div
            className="flex-1 overflow-y-auto border-t pt-3"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#888 #333",
            }}
          >
            <Tabs
              value={tabOption}
              onValueChange={(value: string) =>
                setTabOption(value as "posts" | "friends")
              }
            >
              <TabsList className="grid w-full md:w-[35%] grid-cols-2 bg-cardGray">
                <TabsTrigger value="posts" className="font-medium text-white">
                  Posts
                </TabsTrigger>
                <TabsTrigger value="friends" className="font-medium text-white">
                  Friends
                </TabsTrigger>
              </TabsList>
              <TabsContent value="posts">
                <UserProfilePosts userId={parsedUserId} />
              </TabsContent>
              <TabsContent value="friends">
                <UserFriends user_id={parsedUserId} />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
