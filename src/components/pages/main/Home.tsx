import AddPostCard from "@/components/specific/posts/AddPostCard";
import PostCardsList from "@/components/specific/posts/PostCardList";

const Home = () => {
  return (
    <div className="w-full h-full grid grid-rows-10">
      <div className="row-span-2">
        <AddPostCard />
      </div>
      <div className="row-span-8">
        <PostCardsList />
      </div>
    </div>
  );
};

export default Home;
