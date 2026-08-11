"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ClipboardList } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import api from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";

interface ManagedBooking {
  id: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  event: { id: string; title: string; slug: string };
}

export default function ManageBookingsPage() {
  const { user } = useRequireAuth(["ADMIN", "ORGANIZER"]);
  const [bookings, setBookings] = useState<ManagedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (status) params.set("status", status);

    api
      .get<ApiResponse<ManagedBooking[]>>(`/bookings?${params.toString()}`)
      .then((res) => {
        setBookings(res.data);
        setTotalPages(res.meta?.totalPages ?? 1);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [user, status, page]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            {user.role === "ADMIN" ? "All bookings across the platform." : "Bookings for your events."}
          </p>
        </div>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="w-48"
        >
          <option value="">All statuses</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No bookings found" description="Bookings will appear here once attendees start booking." />
      ) : (
        <>
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-foreground-muted">
                <tr>
                  <th className="px-5 py-3">Attendee</th>
                  <th className="px-5 py-3">Event</th>
                  <th className="px-5 py-3">Qty</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground">{booking.user.name}</p>
                      <p className="text-xs text-foreground-muted">{booking.user.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <Link href={`/events/${booking.event.slug}`} className="text-foreground hover:text-primary-600">
                        {booking.event.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-foreground-muted">{booking.quantity}</td>
                    <td className="px-5 py-3 text-foreground-muted">${booking.totalPrice.toFixed(2)}</td>
                    <td className="px-5 py-3 text-foreground-muted">{format(new Date(booking.createdAt), "MMM d, yyyy")}</td>
                    <td className="px-5 py-3">
                      <Badge tone={booking.status === "CONFIRMED" ? "teal" : booking.status === "CANCELLED" ? "danger" : "neutral"}>
                        {booking.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
