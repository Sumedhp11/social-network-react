import { getSingleUserAPI } from "@/APIs/authAPIs";
import AddPostCard from "@/components/specific/posts/AddPostCard";
import PostCardsList from "@/components/specific/posts/PostCardList";
import StoryScroller from "@/components/specific/stories/StoryScroller";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const { data: userData } = useQuery({
    queryKey: ["user-data"],
    queryFn: () => getSingleUserAPI(),
  });

  return (
    <div className="w-full h-[90vh] mt-5 flex flex-col">
      <div className="mb-4 bg-cardGray rounded-xl">
        <StoryScroller userData={userData} />
      </div>
      <div className="flex-none mb-4">
        <AddPostCard user={userData} />
      </div>

      <div
        className="flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#888 #333",
        }}
      >
        <PostCardsList />
      </div>
    </div>
  );
};

export default Home;
