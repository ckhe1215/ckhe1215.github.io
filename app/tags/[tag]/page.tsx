import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `#${decodedTag} 태그의 포스트`,
    description: `${decodedTag} 태그가 붙은 포스트 목록입니다.`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로가기
        </Button>
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">태그:</h1>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {decodedTag}
          </Badge>
        </div>
        <p className="text-muted-foreground">{posts.length}개의 포스트</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
