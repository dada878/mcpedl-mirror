"use client";

import { getSavedPosts } from "@/actions/post";
import PostCard from "@/components/home/post-card";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";

export default function Page() {
  const {
    data: savedPosts,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["saved-posts"],
    queryFn: () => getSavedPosts(),
  });

  const { toast } = useToast();

  useEffect(() => {
    if (isError) {
      toast({
        description: `錯誤：${error.message}`,
        variant: "destructive",
      });
    }
  }, [isError, toast, error]);

  return (
    <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {isPending && (
        <div className={cn("justify-center pb-8 items-center w-full flex")}>
          <LoaderCircle
            size="24"
            className={cn("animate-spin text-muted-foreground")}
          />
        </div>
      )}
      {!isPending &&
        !isError &&
        savedPosts.map((post) => (
          <PostCard key={post.id} post={post} saved={true} />
        ))}
    </div>
  );
}
