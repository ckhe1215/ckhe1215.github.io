import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground">
          {posts.length}개의 포스트
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          아직 작성된 포스트가 없습니다.
        </p>
      )}
    </div>
  );
}
