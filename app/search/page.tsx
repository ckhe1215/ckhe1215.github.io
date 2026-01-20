import { getAllPosts } from "@/lib/posts";
import { SearchResults } from "@/components/SearchResults";
import { Suspense } from "react";

export default function SearchPage() {
  const posts = getAllPosts();

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <SearchResults posts={posts} />
    </Suspense>
  );
}
