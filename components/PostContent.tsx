interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  return (
    <article
      className="prose prose-neutral dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
