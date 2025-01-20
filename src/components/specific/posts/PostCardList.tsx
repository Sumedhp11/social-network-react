import { getAllpostsAPI } from "@/APIs/postAPIs";
import Loader from "@/components/ui/Loader";
import { PostData } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import NoDataFound from "@/components/common/NoDataFound";
import PostCard from "./PostCard";
const PostCardsList = () => {
  const { ref, inView } = useInView();
  const {
    data: postData,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) =>
      getAllpostsAPI({ page: pageParam, limit: 5 }),
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage?.totalPages as number;
      const currentPage = lastPage?.currentPage as number;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    retry: false,
  });

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage]);

  return isLoading ? (
    <Loader />
  ) : (
    <div
      className="w-full mt-6  overflow-y-auto"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#888 #333",
      }}
    >
      {postData?.pages?.flatMap((page, index) =>
        page?.posts?.length > 0 ? (
          page?.posts?.map((post: PostData) => (
            <PostCard post={post} key={post?.id} />
          ))
        ) : (
          <NoDataFound text={"Sorry, no posts found 😥"} key={index} />
        )
      )}
      {isFetchingNextPage && <Loader />}

      <div ref={ref} />
    </div>
  );
};

export default PostCardsList;
