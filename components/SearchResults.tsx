"use client";

import { useSearchParams } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import type { Post } from "@/types/post";
import { useMemo } from "react";

type SearchResultsProps = {
  posts: Post[];
};

export function SearchResults({ posts }: SearchResultsProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const lowerQuery = query.toLowerCase();

    return posts.filter((post) => {
      const titleMatch = post.frontmatter.title.toLowerCase().includes(lowerQuery);
      const contentMatch = post.content.toLowerCase().includes(lowerQuery);
      const descriptionMatch = post.frontmatter.description?.toLowerCase().includes(lowerQuery);

      return titleMatch || contentMatch || descriptionMatch;
    });
  }, [posts, query]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      {query && (
        <p className="text-muted-foreground mb-8">
          {results.length} {results.length === 1 ? "result" : "results"} for &quot;{query}&quot;
        </p>
      )}

      {!query ? (
        <p className="text-muted-foreground">Please enter a search term.</p>
      ) : results.length === 0 ? (
        <p className="text-muted-foreground">No results found.</p>
      ) : (
        <div className="grid gap-6">
          {results.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
