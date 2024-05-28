import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={post.link} target="_blank" className="block w-full h-full">
      <Card className="w-82 flex flex-col justify-between h-full hover:bg-muted cursor-pointer transition">
      <CardHeader>
        <Image src={post.image} alt={post.title} width={400} height={200} />
      </CardHeader>
      <CardContent>
        <CardTitle className="text-xl">{post.index} {post.title}</CardTitle>
        <CardDescription>{post.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <small>Publish date {post.date.toISOString().split("T")[0].replaceAll("-", " / ")}</small>
      </CardFooter>
    </Card>
    </Link>
  );
}
