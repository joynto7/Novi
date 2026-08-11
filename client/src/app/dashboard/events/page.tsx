"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, CalendarRange } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useToast } from "@/context/ToastContext";
import api from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";

interface ManagedEvent {
  id: string;
  title: string;
  slug: string;
  startDate: string;
  price: number;
  capacity: number;
  seatsBooked: number;
  status: string;
  category: { name: string };
  organizer?: { id: string; name: string };
  _count: { bookings: number; reviews: number };
}

export default function ManageEventsPage() {
  const { user } = useRequireAuth(["ORGANIZER", "ADMIN"]);
  const { showToast } = useToast();
  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ManagedEvent | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get<ApiResponse<ManagedEvent[]>>("/events/mine")
      .then((res) => setEvents(res.data))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/events/${deleteTarget.id}`);
      setEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      showToast("Event deleted.", "success");
    } catch {
      showToast("Could not delete event.", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{user.role === "ADMIN" ? "Manage Events" : "My Events"}</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            {user.role === "ADMIN" ? "All events across the platform." : "Events you're organizing."}
          </p>
        </div>
        <Link href="/dashboard/events/new">
          <Button>
            <Plus className="h-4 w-4" /> New Event
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="No events yet"
          description="Create your first event to start accepting bookings."
          action={
            <Link href="/dashboard/events/new">
              <Button size="sm">Create Event</Button>
            </Link>
          }
        />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-foreground-muted">
              <tr>
                <th className="px-5 py-3">Event</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Seats</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-foreground-muted">
                      {event.category.name}
                      {event.organizer && user.role === "ADMIN" ? ` · ${event.organizer.name}` : ""}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-foreground-muted">{format(new Date(event.startDate), "MMM d, yyyy")}</td>
                  <td className="px-5 py-3 text-foreground-muted">{event.price === 0 ? "Free" : `$${event.price}`}</td>
                  <td className="px-5 py-3 text-foreground-muted">
                    {event.seatsBooked}/{event.capacity}
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={event.status === "PUBLISHED" ? "teal" : "neutral"}>{event.status}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/events/${event.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                        aria-label="Edit event"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(event)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label="Delete event"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete event?">
        <p className="text-sm text-foreground-muted">
          Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
