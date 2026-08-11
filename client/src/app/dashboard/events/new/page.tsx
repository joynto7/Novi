"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { EventForm } from "@/components/dashboard/EventForm";

export default function NewEventPage() {
  const { user } = useRequireAuth(["ORGANIZER", "ADMIN"]);
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Event</h1>
        <p className="mt-1 text-sm text-foreground-muted">Fill in the details for your new event.</p>
      </div>
      <EventForm mode="create" />
    </div>
  );
}
