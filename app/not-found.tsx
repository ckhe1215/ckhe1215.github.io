"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const breads = ["🍞", "🥐", "🥖"];

export default function NotFound() {
  const [bread, setBread] = useState("🍞");

  useEffect(() => {
    const randomBread = breads[Math.floor(Math.random() * breads.length)];
    setBread(randomBread);
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <div className="text-8xl font-bold text-primary animate-bounce">
            404
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            페이지를 찾을 수 없습니다
          </h1>
        </div>

        <p className="text-muted-foreground text-lg">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>

        <div className="pt-4">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              홈으로 돌아가기
            </Button>
          </Link>
        </div>

        <div className="pt-8 text-6xl opacity-50">
          {bread}
        </div>
      </div>
    </div>
  );
}
