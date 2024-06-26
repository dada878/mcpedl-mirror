"use client";

import { getPosts, getSavedPosts, getTopPopularPosts } from "@/actions/post";
import PostCard from "@/components/home/post-card";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useRef } from "react";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

export default function InfiniteLoader({
  type,
}: {
  type: "addon" | "map" | "texture" | "popular";
}) {
  const [items, setItems] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchedPages = useRef<number[]>([]);

  const { data: savedPosts } = useQuery({
    queryKey: ["saved-posts"],
    queryFn: () => getSavedPosts(),
  });

  function loadMore() {
    if (fetchedPages.current.includes(page)) {
      return;
    }
    fetchedPages.current.push(page);

    if (type === "popular") {
      getTopPopularPosts(page * 10).then((data) => {
        if (data.length === items.length) {
          setHasMore(false);
          return;
        }
        setPage((p) => p + 1);
        setItems(data.filter((post) => post !== null && post !== undefined)
          .map((post) => post as Post));
      });
    } else {
      getPosts(page, type).then((data) => {
        if (data.length === 0) {
          setHasMore(false);
          return;
        }
        setPage((p) => p + 1);
        setItems((items) => [...items, ...data]);
      });
    }
  }

  return (
    <>
      <InfiniteScroll
        className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        loadMore={loadMore}
        hasMore={true}
      >
        {items.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            saved={
              (savedPosts ?? []).filter(
                (savedPost: Post) => savedPost.id === post.id
              ).length > 0
            }
          />
        ))}
      </InfiniteScroll>
      <div>
        {hasMore ? (
          <div
            className={cn("justify-center pb-8 items-center flex", {
              hidden: !hasMore,
            })}
          >
            <LoaderCircle
              size="24"
              className={cn("animate-spin text-muted-foreground", {})}
            />
          </div>
        ) : (
          <div className="text-center pb-8 text-muted-foreground">
            <p>沒有更多貼文了 :p</p>
          </div>
        )}
      </div>
    </>
  );
}
