"use client";

import { useEffect, useRef, useState } from "react";

export function Comments() {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (
      !ref.current ||
      !mounted ||
      !repo ||
      !repoId ||
      !category ||
      !categoryId
    )
      return;

    // Clear existing content
    ref.current.innerHTML = "";

    // Create and append the giscus script
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    ref.current.appendChild(script);
  }, [mounted, repo, repoId, category, categoryId]);

  if (!mounted) {
    return <div className="h-32 rounded-lg bg-muted/50 animate-pulse" />;
  }

  return <div ref={ref} className="giscus" />;
}
