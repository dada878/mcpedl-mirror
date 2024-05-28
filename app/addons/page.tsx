"use client";

import { getPosts } from "@/actions/post";
import PostCard from "@/components/home/post-card";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

export default function Page() {
  const [items, setItems] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  function loadMore() {
    console.log("load more");
    getPosts(page).then((data) => {
      if (data.length === 0) {
        setHasMore(false);
        return;
      }
      setPage((p) => p + 1);
      setItems([...items, ...data]);
    });
  }

  return (
    <InfiniteScroll
      className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      loadMore={loadMore}
      hasMore={true}
      loader={
        <Card
          className={cn("w-82 min-h-80 justify-center items-center flex", {
            hidden: !hasMore,
          })}
        >
          <LoaderCircle size="32" className={cn("animate-spin", {})} />
        </Card>
      }
    >
      {items.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </InfiniteScroll>
  );
}
