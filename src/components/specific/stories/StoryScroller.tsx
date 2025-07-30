import { getAllStoryAPI } from "@/APIs/storyAPIs";
import { cacheKeyStore } from "@/constants";
import { userInterface } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import StoryAvatar from "./StoryAvatar";

export interface Story {
  id: number;
  content: string;
  createdAt: string;
}

export interface StoryUser {
  id: number;
  username: string;
  avatarUrl: string;
}

export interface UserWithStories {
  user: StoryUser;
  stories: Story[];
}

const StoryScroller = ({ userData }: { userData: userInterface }) => {
  const { isLoading, data } = useQuery({
    queryKey: [cacheKeyStore.stories],
    queryFn: getAllStoryAPI,
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  const userStory = data[0];
  const friendStories = data.slice(1);

  const hasFriendStories = friendStories.length > 0;

  return (
    <div className="py-4 px-2 flex items-center gap-5 overflow-x-auto scrollbar-hide">
      <StoryAvatar
        key={userData?.id}
        storyData={userStory}
        index={0}
        userData={userData}
      />

      {hasFriendStories &&
        friendStories.map((story: UserWithStories, index: number) => (
          <StoryAvatar
            key={story.user.id}
            storyData={story}
            index={index + 1}
            userData={userData}
          />
        ))}
    </div>
  );
};

export default StoryScroller;
