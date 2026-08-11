"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import api from "@/lib/api";
import { ApiResponse, ChartPoint, EventCard } from "@/lib/types";
import { DashboardBarChart, DashboardLineChart, DashboardPieChart } from "@/components/dashboard/Charts";
import { Card } from "@/components/ui/Card";
import { PageSpinner } from "@/components/ui/Spinner";

interface AdminStats {
  overview: { totalUsers: number; totalEvents: number; totalBookings: number; totalRevenue: number };
  bookingsTrend: ChartPoint[];
  revenueTrend: ChartPoint[];
  eventsByCategory: ChartPoint[];
}

export default function AnalyticsPage() {
  const { user } = useRequireAuth(["ADMIN"]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [topEvents, setTopEvents] = useState<EventCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get<ApiResponse<AdminStats>>("/dashboard/admin-stats"),
      api.get<ApiResponse<EventCard[]>>("/events?limit=100&timeframe=all"),
    ])
      .then(([statsRes, eventsRes]) => {
        setStats(statsRes.data);
        setTopEvents([...eventsRes.data].sort((a, b) => b.seatsBooked - a.seatsBooked).slice(0, 5));
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user || loading || !stats) return <PageSpinner label="Loading analytics..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-foreground-muted">Platform performance at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardLineChart title="Revenue trend (6 months)" data={stats.revenueTrend} />
        <DashboardBarChart title="Bookings trend (6 months)" data={stats.bookingsTrend} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardPieChart title="Events by category" data={stats.eventsByCategory} />

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Top events by seats booked</h3>
          <div className="space-y-3">
            {topEvents.map((event, i) => (
              <div key={event.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                    {i + 1}
                  </span>
                  <Link href={`/events/${event.slug}`} className="text-sm font-medium text-foreground hover:text-primary-600">
                    {event.title}
                  </Link>
                </div>
                <span className="text-sm text-foreground-muted">
                  {event.seatsBooked}/{event.capacity} seats
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
