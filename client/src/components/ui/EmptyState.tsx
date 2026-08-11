import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface-muted/50 px-6 py-16 text-center">
      <Icon className="h-10 w-10 text-foreground-muted" />
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="max-w-sm text-sm text-foreground-muted">{description}</p>}
      {action}
    </div>
  );
}
