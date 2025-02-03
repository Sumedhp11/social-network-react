import AddPostCard from "@/components/specific/posts/AddPostCard";
import PostCardsList from "@/components/specific/posts/PostCardList";

const Home = () => {
  return (
    <div className="w-full h-[90vh] mt-5 flex flex-col">
      <div className="flex-none mb-4">
        <AddPostCard />
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
