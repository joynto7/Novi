"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import api from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

interface OrganizerEvent {
  id: string;
  title: string;
  slug: string;
  _count: { reviews: number; bookings: number };
}

export default function OrganizerReviewsPage() {
  const { user } = useRequireAuth(["ORGANIZER", "ADMIN"]);
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api
      .get<ApiResponse<OrganizerEvent[]>>("/events/mine")
      .then((res) => setEvents(res.data))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
        <p className="mt-1 text-sm text-foreground-muted">Attendee feedback across your events.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState icon={Star} title="No events yet" description="Create an event to start collecting reviews." />
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Card key={event.id} className="flex items-center justify-between p-4">
              <div>
                <Link href={`/events/${event.slug}`} className="font-medium text-foreground hover:text-primary-600">
                  {event.title}
                </Link>
                <p className="text-xs text-foreground-muted">{event._count.bookings} bookings</p>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
                {event._count.reviews} review{event._count.reviews === 1 ? "" : "s"}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
