import Link from "next/link";
import {
  Music,
  Cpu,
  Briefcase,
  Palette,
  Trophy,
  Utensils,
  HeartPulse,
  GraduationCap,
  LucideIcon,
  Layers,
} from "lucide-react";
import { Category } from "@/lib/types";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";

const ICONS: Record<string, LucideIcon> = {
  music: Music,
  cpu: Cpu,
  briefcase: Briefcase,
  palette: Palette,
  trophy: Trophy,
  utensils: Utensils,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
};

export function CategoryGrid({ categories, loading }: { categories: Category[]; loading: boolean }) {
  return (
    <section className="bg-surface-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Browse by interest"
          title="Explore categories"
          description="From live music to wellness retreats, find the experiences that match your interests."
          align="center"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
            : categories.map((category) => {
                const Icon = ICONS[category.icon] || Layers;
                return (
                  <Link
                    key={category.id}
                    href={`/events?category=${category.slug}`}
                    className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-6 text-center transition-all hover:-translate-y-1 hover:border-primary-300 hover:shadow-md"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-900/40 dark:text-primary-300">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{category.name}</p>
                      <p className="text-xs text-foreground-muted">{category._count?.events ?? 0} events</p>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}
