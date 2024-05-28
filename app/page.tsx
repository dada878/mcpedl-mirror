import InfiniteLoader from "@/components/home/infinite-post-loader";
import { defaultSEO } from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = defaultSEO();

export default function Home() {
  return (
    <>
      <InfiniteLoader type="popular" />
    </>
  );
}
