import { Quote } from "lucide-react";
import { Review } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { StarRating } from "@/components/ui/StarRating";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";

interface TestimonialReview extends Review {
  event: { id: string; title: string; slug: string };
}

export function Testimonials({ reviews, loading }: { reviews: TestimonialReview[]; loading: boolean }) {
  if (!loading && reviews.length === 0) return null;

  return (
    <section className="bg-surface-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Loved by attendees"
          title="What people are saying"
          description="Real feedback from real attendees across the events hosted on Novi."
          align="center"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)
            : reviews.slice(0, 6).map((review) => (
                <div
                  key={review.id}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm"
                >
                  <Quote className="h-6 w-6 text-primary-300" />
                  <p className="flex-1 text-sm text-foreground-muted">&ldquo;{review.comment}&rdquo;</p>
                  <StarRating value={review.rating} size={16} />
                  <div className="flex items-center gap-3 border-t border-border pt-4">
                    <Avatar src={review.user.avatar} name={review.user.name} size={40} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{review.user.name}</p>
                      <p className="text-xs text-foreground-muted">on {review.event.title}</p>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
