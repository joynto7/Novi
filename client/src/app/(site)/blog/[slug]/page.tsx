"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { ApiResponse, BlogPost } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { PageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get<ApiResponse<BlogPost>>(`/blog/${params.slug}`)
      .then((res) => {
        if (active) setPost(res.data);
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.slug]);

  if (loading) return <PageSpinner label="Loading article..." />;

  if (notFound || !post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState title="Post not found" description="This article may have been removed." />
        <div className="mt-6 text-center">
          <Link href="/blog" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/blog" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>

      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{post.title}</h1>

      <div className="mt-5 flex items-center gap-3">
        <Avatar src={post.author.avatar} name={post.author.name} size={40} />
        <div>
          <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
          <p className="text-xs text-foreground-muted">{format(new Date(post.createdAt), "MMMM d, yyyy")}</p>
        </div>
      </div>

      <div className="relative mt-8 h-64 w-full overflow-hidden rounded-2xl sm:h-96">
        <Image src={post.coverImage} alt={post.title} fill priority sizes="800px" className="object-cover" />
      </div>

      <div className="mt-8 space-y-4 text-base leading-relaxed text-foreground-muted">
        {post.content.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
