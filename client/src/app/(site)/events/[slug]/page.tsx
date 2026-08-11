"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, MapPin, Clock, Users, ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { ApiResponse, EventDetail, EventCard as EventCardType } from "@/lib/types";
import { ImageGallery } from "@/components/events/ImageGallery";
import { BookingWidget } from "@/components/events/BookingWidget";
import { ReviewsSection } from "@/components/events/ReviewsSection";
import { EventCard } from "@/components/events/EventCard";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { Avatar } from "@/components/ui/Avatar";
import { PageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";

export default function EventDetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [related, setRelated] = useState<EventCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);

    Promise.all([
      api.get<ApiResponse<EventDetail>>(`/events/${slug}`),
      api.get<ApiResponse<EventCardType[]>>(`/events/${slug}/related`).catch(() => ({ data: [] })),
    ])
      .then(([eventRes, relatedRes]) => {
        if (!active) return;
        setEvent(eventRes.data);
        setRelated(relatedRes.data);
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
  }, [slug]);

  if (loading) return <PageSpinner label="Loading event..." />;

  if (notFound || !event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState title="Event not found" description="This event may have been removed or the link is incorrect." />
        <div className="mt-6 text-center">
          <Link href="/events" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
            Browse all events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/events"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to events
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ImageGallery images={event.images} title={event.title} />

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge tone="primary">{event.category.name}</Badge>
            {event.featured && <Badge tone="accent">Featured</Badge>}
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{event.title}</h1>

          <div className="mt-3 flex items-center gap-2">
            <StarRating value={event.avgRating} />
            <span className="text-sm text-foreground-muted">
              {event.avgRating > 0 ? `${event.avgRating.toFixed(1)} (${event.reviewCount} reviews)` : "No reviews yet"}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 shrink-0 text-primary-600" />
              <div>
                <p className="text-xs text-foreground-muted">Date</p>
                <p className="text-sm font-medium text-foreground">
                  {format(new Date(event.startDate), "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 shrink-0 text-primary-600" />
              <div>
                <p className="text-xs text-foreground-muted">Time</p>
                <p className="text-sm font-medium text-foreground">{format(new Date(event.startDate), "h:mm a")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-primary-600" />
              <div>
                <p className="text-xs text-foreground-muted">Location</p>
                <p className="text-sm font-medium text-foreground">
                  {event.venue}, {event.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 shrink-0 text-primary-600" />
              <div>
                <p className="text-xs text-foreground-muted">Capacity</p>
                <p className="text-sm font-medium text-foreground">
                  {event.seatsBooked} / {event.capacity} booked
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground">Overview</h2>
              <p className="mt-2 text-foreground-muted leading-relaxed">{event.overview}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">Description</h2>
              <p className="mt-2 text-foreground-muted leading-relaxed">{event.description}</p>
            </section>
            <section className="flex items-center gap-3 rounded-2xl border border-border bg-surface-muted/50 p-4">
              <Avatar src={event.organizer.avatar} name={event.organizer.name} size={44} />
              <div>
                <p className="text-xs text-foreground-muted">Hosted by</p>
                <p className="text-sm font-semibold text-foreground">{event.organizer.name}</p>
              </div>
            </section>
          </div>

          <div className="mt-10">
            <ReviewsSection
              eventId={event.id}
              reviews={event.reviews}
              onReviewAdded={(review) =>
                setEvent((prev) => (prev ? { ...prev, reviews: [review, ...prev.reviews] } : prev))
              }
            />
          </div>
        </div>

        <div>
          <BookingWidget event={event} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Related Events</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
