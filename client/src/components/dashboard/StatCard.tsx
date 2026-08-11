import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type Tone = "primary" | "accent" | "teal";

const TONE_CLASSES: Record<Tone, string> = {
  primary: "bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300",
  accent: "bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-300",
  teal: "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: Tone;
}) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", TONE_CLASSES[tone])}>
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="text-sm text-foreground-muted">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </Card>
  );
}
