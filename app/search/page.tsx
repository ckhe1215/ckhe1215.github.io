"use client";

import { useSearchParams } from "next/navigation";
import { searchPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const results = query ? searchPosts(query) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">검색 결과</h1>
      {query && (
        <p className="text-muted-foreground mb-8">
          &quot;{query}&quot;에 대한 검색 결과 {results.length}건
        </p>
      )}

      {!query ? (
        <p className="text-muted-foreground">검색어를 입력해주세요.</p>
      ) : results.length === 0 ? (
        <p className="text-muted-foreground">검색 결과가 없습니다.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
