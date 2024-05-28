import {
  savePost,
  removeSavedPost,
  getSavedPosts,
} from "@/actions/post";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PostCard({
  post,
  saved,
}: {
  post: Post;
  saved: boolean;
}) {
  const {
    data: savedPosts,
  } = useQuery({
    queryKey: ["saved-posts"],
    queryFn: () => getSavedPosts(),
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async () => {
      if (saved) {
        await removeSavedPost(post.id);
      } else {
        await savePost(post.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["saved-posts"],
      });
    },
    onMutate: () => {
      if (saved) {
        queryClient.setQueryData(
          ["saved-posts"],
          (savedPosts ?? []).filter(
            (savedPost: Post) => savedPost.id !== post.id
          )
        );
      } else {
        queryClient.setQueryData(
          ["saved-posts"],
          [...(savedPosts ?? []), post]
        );
      }
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: `錯誤：${error.message}`,
      });
      if (saved) {
        queryClient.setQueryData(
          ["saved-posts"],
          (savedPosts ?? []).filter(
            (savedPost: Post) => savedPost.id !== post.id
          )
        );
      } else {
        queryClient.setQueryData(
          ["saved-posts"],
          [...(savedPosts ?? []), post]
        );
      }
    },
  });


  return (
    <Card className="w-82 flex flex-col h-full transition justify-between">
      <Link href={post.link} target="_blank" className="block w-full h-full">
        <CardHeader>
          <Image
            src={post.image}
            alt={post.title}
            width={400}
            height={200}
            className="w-full"
          />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-xl">{post.title}</CardTitle>
          <CardDescription>{post.description}</CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="flex gap-6 items-center cursor-default">
        <small className="text-nowrap whitespace-nowrap">
          {post.date.toISOString().split("T")[0].replaceAll("-", " / ")}
        </small>
        <div className="flex justify-end gap-2 w-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                onClick={() => {
                  mutation.mutate();
                }}
                >
                  {saved ? (
                    <Star
                      size={26}
                      className="cursor-pointer"
                      fill="#ffd363"
                      color="#f3ab4e"
                    />
                  ) : (
                    <Star size={26} className="cursor-pointer" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>收藏</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}
