"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { TagBadge } from "./TagBadge";
import type { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/tags/${tag}`);
  };

  return (
    <Link href={`/${post.slug}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-[220px] flex flex-col">
        <CardHeader>
          <CardTitle className="hover:text-primary transition-colors line-clamp-2">
            {post.frontmatter.title}
          </CardTitle>
          <CardDescription>
            {new Date(post.frontmatter.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-muted-foreground line-clamp-2">
            {post.frontmatter.description}
          </p>
        </CardContent>
        <CardFooter className="flex gap-2 flex-wrap mt-auto">
          {post.frontmatter.tags.map((tag) => (
            <span key={tag} onClick={(e) => handleTagClick(e, tag)}>
              <TagBadge tag={tag} asLink={false} />
            </span>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}
