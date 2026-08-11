import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { BlogPost } from "@/lib/types";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export function BlogPreview({ posts, loading }: { posts: BlogPost[]; loading: boolean }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader
          eyebrow="From the blog"
          title="Tips, stories & insights"
          description="Guides for organizers and attendees alike, straight from the Occasio team."
        />
        <Link
          href="/blog"
          className="mb-10 flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          Read all posts <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)
          : posts.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <p className="text-xs font-medium text-foreground-muted">
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </p>
                  <h3 className="line-clamp-2 text-base font-semibold text-foreground">{post.title}</h3>
                  <p className="line-clamp-2 text-sm text-foreground-muted">{post.excerpt}</p>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}
