"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Newspaper } from "lucide-react";
import api from "@/lib/api";
import { ApiResponse, BlogPost } from "@/lib/types";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Avatar } from "@/components/ui/Avatar";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .get<ApiResponse<BlogPost[]>>(`/blog?page=${page}&limit=6`)
      .then((res) => {
        setPosts(res.data);
        setTotalPages(res.meta?.totalPages ?? 1);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">The Novi Blog</h1>
        <p className="mt-3 text-foreground-muted">Tips, stories, and insights for organizers and attendees.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState icon={Newspaper} title="No posts yet" description="Check back soon for new articles." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <p className="text-xs font-medium text-foreground-muted">
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </p>
                  <h2 className="text-lg font-semibold text-foreground">{post.title}</h2>
                  <p className="line-clamp-3 flex-1 text-sm text-foreground-muted">{post.excerpt}</p>
                  <div className="flex items-center gap-2 border-t border-border pt-3">
                    <Avatar src={post.author.avatar} name={post.author.name} size={28} />
                    <span className="text-xs font-medium text-foreground-muted">{post.author.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
