import { isSaved, savePost, removeSavedPost } from "@/actions/post";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PostCard({ post }: { post: Post }) {
  const { data: saved } = useQuery({
    queryKey: ["is-saved", post.id],
    queryFn: () => isSaved(post.id),
  });

  const queryClient = useQueryClient();

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
        queryKey: ["is-saved", post.id],
      });
    },
    onMutate: () => {
      queryClient.setQueryData(["is-saved", post.id], !saved);
    },
    onError: () => {
      queryClient.setQueryData(["is-saved", post.id], saved);
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
