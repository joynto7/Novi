import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Star } from "lucide-react";
import { format } from "date-fns";
import { EventCard as EventCardType } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

export function EventCard({ event }: { event: EventCardType }) {
  const seatsLeft = event.capacity - event.seatsBooked;
  const isSoldOut = seatsLeft <= 0;

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={event.images[0]}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {event.featured && (
            <span className="inline-flex items-center rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold text-accent-200 backdrop-blur-sm">
              Featured
            </span>
          )}
          {isSoldOut && <Badge tone="danger">Sold Out</Badge>}
        </div>
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold text-accent-300 backdrop-blur-sm">
            {event.price === 0 ? "Free" : `$${event.price}`}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <p className="w-fit text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
          {event.category.name}
        </p>
        <h3 className="line-clamp-1 font-display text-base font-semibold text-foreground">{event.title}</h3>
        <p className="line-clamp-2 text-sm text-foreground-muted">{event.shortDescription}</p>

        <div className="mt-auto space-y-1.5 pt-2 text-sm text-foreground-muted">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 shrink-0 text-accent-600 dark:text-accent-400" />
            <span>{format(new Date(event.startDate), "MMM d, yyyy · h:mm a")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-accent-600 dark:text-accent-400" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1 text-sm font-medium text-foreground">
            <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
            {event.avgRating > 0 ? event.avgRating.toFixed(1) : "New"}
            {event.reviewCount > 0 && (
              <span className="font-normal text-foreground-muted">({event.reviewCount})</span>
            )}
          </div>
          <span className="rounded-full border border-accent-600 px-4 py-1.5 text-xs font-semibold text-accent-700 transition-colors group-hover:border-accent-500 group-hover:bg-accent-500 group-hover:text-primary-900 dark:border-accent-400 dark:text-accent-400 dark:group-hover:bg-accent-500 dark:group-hover:text-primary-900">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
