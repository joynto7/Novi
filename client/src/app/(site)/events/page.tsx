"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarSearch } from "lucide-react";
import api from "@/lib/api";
import { ApiResponse, Category, EventCard as EventCardType } from "@/lib/types";
import { EventCard } from "@/components/events/EventCard";
import { EventsFilters, EventFiltersState } from "@/components/events/EventsFilters";
import { EventCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";

const DEFAULT_FILTERS: EventFiltersState = {
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  sort: "startDate_asc",
};

export default function EventsPage() {
  return (
    <Suspense fallback={null}>
      <EventsPageContent />
    </Suspense>
  );
}

function EventsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<EventFiltersState>(() => ({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "startDate_asc",
  }));
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<EventCardType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<ApiResponse<Category[]>>("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => undefined);
  }, []);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sort) params.set("sort", filters.sort);
    params.set("page", String(page));
    params.set("limit", "9");
    return params.toString();
  }, [filters, page]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    api
      .get<ApiResponse<EventCardType[]>>(`/events?${queryString}`)
      .then((res) => {
        if (!active) return;
        setEvents(res.data);
        setTotalPages(res.meta?.totalPages ?? 1);
        setTotal(res.meta?.total ?? res.data.length);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const url = new URLSearchParams(queryString);
    router.replace(`/events?${url.toString()}`, { scroll: false });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const handleFilterChange = useCallback((update: Partial<EventFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...update }));
    setPage(1);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Explore Events</h1>
        <p className="mt-2 text-foreground-muted">
          {loading ? "Searching events..." : `${total} event${total === 1 ? "" : "s"} found`}
        </p>
      </div>

      <div className="mb-8">
        <EventsFilters categories={categories} filters={filters} onChange={handleFilterChange} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarSearch}
          title="No events match your filters"
          description="Try adjusting your search terms, category, or price range to see more results."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
