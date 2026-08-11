import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EventCard as EventCardType } from "@/lib/types";
import { EventCard } from "@/components/events/EventCard";
import { EventCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/home/SectionHeader";

export function FeaturedEvents({ events, loading }: { events: EventCardType[]; loading: boolean }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader
          eyebrow="Handpicked for you"
          title="Featured events"
          description="A curated lineup of the most anticipated experiences happening soon."
        />
        <Link
          href="/events"
          className="mb-10 flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          View all events <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState title="No featured events yet" description="Check back soon for upcoming highlights." />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
