"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useAuth, ApiRequestError } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import api from "@/lib/api";
import { Review } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { MessageSquare } from "lucide-react";

interface ReviewsSectionProps {
  eventId: string;
  reviews: Review[];
  onReviewAdded: (review: Review) => void;
}

export function ReviewsSection({ eventId, reviews, onReviewAdded }: ReviewsSectionProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const alreadyReviewed = user && reviews.some((r) => r.user.id === user.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (comment.trim().length < 3) {
      setError("Please write a short comment about your experience.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post<{ data: Review }>(`/events/${eventId}/reviews`, { rating, comment });
      onReviewAdded(res.data);
      setComment("");
      setRating(5);
      showToast("Thanks for sharing your review!", "success");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not submit your review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Reviews ({reviews.length})</h2>

      {user && !alreadyReviewed && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-5">
          <p className="mb-2 text-sm font-medium text-foreground">Rate your experience</p>
          <StarRating value={rating} onChange={setRating} readOnly={false} size={24} />
          <div className="mt-3">
            <Textarea
              placeholder="Share your experience with other attendees..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              error={error}
              required
            />
          </div>
          <Button type="submit" loading={submitting} className="mt-3">
            Submit Review
          </Button>
        </form>
      )}

      {reviews.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No reviews yet" description="Be the first to share your experience with this event." />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-3 rounded-2xl border border-border bg-surface p-4">
              <Avatar src={review.user.avatar} name={review.user.name} size={40} />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{review.user.name}</p>
                  <p className="text-xs text-foreground-muted">{format(new Date(review.createdAt), "MMM d, yyyy")}</p>
                </div>
                <StarRating value={review.rating} size={14} />
                <p className="mt-1.5 text-sm text-foreground-muted">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
