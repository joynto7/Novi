import { CalendarCheck, Users, MapPinned, Star } from "lucide-react";

interface Stats {
  totalEvents: number;
  totalCategories: number;
  totalCities: number;
  totalAttendees: number;
}

export function StatsSection({ stats }: { stats: Stats }) {
  const items = [
    { icon: CalendarCheck, label: "Events hosted", value: stats.totalEvents },
    { icon: MapPinned, label: "Cities covered", value: stats.totalCities },
    { icon: Users, label: "Happy attendees", value: stats.totalAttendees },
    { icon: Star, label: "Event categories", value: stats.totalCategories },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-6 rounded-3xl border border-border bg-surface p-8 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300">
              <item.icon className="h-6 w-6" />
            </span>
            <p className="text-3xl font-bold text-foreground">{item.value.toLocaleString()}+</p>
            <p className="mt-1 text-sm text-foreground-muted">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
