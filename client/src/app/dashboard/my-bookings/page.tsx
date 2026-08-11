"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Ticket } from "lucide-react";
import api from "@/lib/api";
import { ApiResponse, Booking } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<ApiResponse<Booking[]>>("/bookings/mine")
      .then((res) => setBookings(res.data))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
        <p className="mt-1 text-sm text-foreground-muted">All the events you&apos;ve reserved a spot for.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No bookings yet"
          description="Once you book an event, it will show up here with all the details."
          action={
            <Link href="/events">
              <Button size="sm">Browse Events</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isPast = new Date(booking.event.startDate) < new Date();
            return (
              <Card key={booking.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl sm:w-36">
                  <Image src={booking.event.images[0]} alt={booking.event.title} fill sizes="144px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/events/${booking.event.slug}`} className="text-base font-semibold text-foreground hover:text-primary-600">
                      {booking.event.title}
                    </Link>
                    <Badge tone={isPast ? "neutral" : "teal"}>{isPast ? "Past" : booking.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-foreground-muted">
                    {format(new Date(booking.event.startDate), "EEEE, MMMM d, yyyy · h:mm a")}
                  </p>
                  {booking.event.location && <p className="text-sm text-foreground-muted">{booking.event.location}</p>}
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {booking.quantity} ticket{booking.quantity > 1 ? "s" : ""} &middot; $
                    {booking.totalPrice.toFixed(2)}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
