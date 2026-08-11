"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import api from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { EventForm } from "@/components/dashboard/EventForm";
import { PageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";

interface EventRecord {
  id: string;
  title: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  overview: string;
  images: string[];
  location: string;
  venue: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  featured: boolean;
}

export default function EditEventPage() {
  const { user } = useRequireAuth(["ORGANIZER", "ADMIN"]);
  const params = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) return;
    api
      .get<ApiResponse<EventRecord>>(`/events/id/${params.id}`)
      .then((res) => setEvent(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user, params.id]);

  if (!user || loading) return <PageSpinner label="Loading event..." />;
  if (error || !event) return <EmptyState title="Event not found" description="This event may have been removed." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit Event</h1>
        <p className="mt-1 text-sm text-foreground-muted">Update the details for {event.title}.</p>
      </div>
      <EventForm mode="edit" eventId={event.id} defaultValues={event} />
    </div>
  );
}
