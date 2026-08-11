import { cn } from "@/lib/cn";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("mb-10 max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wide text-primary-600">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-base text-foreground-muted">{description}</p>}
    </div>
  );
}
