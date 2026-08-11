"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarCheck, DollarSign, Ticket, Star, Users, TrendingUp, Tag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { ApiResponse, Booking, ChartPoint } from "@/lib/types";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardLineChart, DashboardBarChart, DashboardPieChart } from "@/components/dashboard/Charts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";

interface UserStats {
  overview: { totalBookings: number; upcomingEvents: number; totalSpent: number; reviewsWritten: number };
  spendTrend: ChartPoint[];
  recentBookings: Booking[];
}

interface AdminStats {
  overview: { totalUsers: number; totalEvents: number; totalBookings: number; totalRevenue: number };
  bookingsTrend: ChartPoint[];
  revenueTrend: ChartPoint[];
  eventsByCategory: ChartPoint[];
}

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdminLike = user?.role === "ADMIN" || user?.role === "ORGANIZER";

  useEffect(() => {
    if (!user) return;
    const endpoint = isAdminLike ? "/dashboard/admin-stats" : "/dashboard/user-stats";

    api
      .get<ApiResponse<UserStats | AdminStats>>(endpoint)
      .then((res) => {
        if (isAdminLike) setAdminStats(res.data as AdminStats);
        else setUserStats(res.data as UserStats);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [user, isAdminLike]);

  if (!user || loading) return <PageSpinner label="Loading overview..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Here&apos;s what&apos;s happening with your {isAdminLike ? "platform" : "events"} today.
        </p>
      </div>

      {isAdminLike && adminStats && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} label="Total Users" value={adminStats.overview.totalUsers} tone="primary" />
            <StatCard icon={CalendarCheck} label="Total Events" value={adminStats.overview.totalEvents} tone="accent" />
            <StatCard icon={Ticket} label="Total Bookings" value={adminStats.overview.totalBookings} tone="teal" />
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value={`$${adminStats.overview.totalRevenue.toLocaleString()}`}
              tone="primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <DashboardLineChart title="Revenue (last 6 months)" data={adminStats.revenueTrend} />
            </div>
            <DashboardPieChart title="Events by Category" data={adminStats.eventsByCategory} />
          </div>
          <DashboardBarChart title="Bookings (last 6 months)" data={adminStats.bookingsTrend} />
        </>
      )}

      {!isAdminLike && userStats && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Ticket} label="Total Bookings" value={userStats.overview.totalBookings} tone="primary" />
            <StatCard icon={CalendarCheck} label="Upcoming Events" value={userStats.overview.upcomingEvents} tone="accent" />
            <StatCard
              icon={DollarSign}
              label="Total Spent"
              value={`$${userStats.overview.totalSpent.toLocaleString()}`}
              tone="teal"
            />
            <StatCard icon={Star} label="Reviews Written" value={userStats.overview.reviewsWritten} tone="primary" />
          </div>

          <DashboardLineChart title="Your spending (last 6 months)" data={userStats.spendTrend} />

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Recent Bookings</h3>
              <Link href="/dashboard/my-bookings" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            {userStats.recentBookings.length === 0 ? (
              <EmptyState icon={Tag} title="No bookings yet" description="Browse events and book your first experience." />
            ) : (
              <div className="divide-y divide-border">
                {userStats.recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <Link
                        href={`/events/${booking.event.slug}`}
                        className="text-sm font-semibold text-foreground hover:text-primary-600"
                      >
                        {booking.event.title}
                      </Link>
                      <p className="text-xs text-foreground-muted">
                        {format(new Date(booking.event.startDate), "MMM d, yyyy")} &middot; {booking.quantity} ticket
                        {booking.quantity > 1 ? "s" : ""}
                      </p>
                    </div>
                    <Badge tone={booking.status === "CONFIRMED" ? "teal" : "neutral"}>{booking.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {!isAdminLike && !userStats && (
        <div className="flex items-center gap-2 text-sm text-foreground-muted">
          <TrendingUp className="h-4 w-4" /> Stats will appear here once you book your first event.
        </div>
      )}
    </div>
  );
}
