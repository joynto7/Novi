import Link from "next/link";
import { CalendarCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

const HIGHLIGHTS = [
  { icon: CalendarCheck, text: "Instant booking confirmation for every event" },
  { icon: ShieldCheck, text: "Secure, role-based access for organizers & admins" },
  { icon: Sparkles, text: "Curated recommendations tailored to your interests" },
];

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 p-12 text-white lg:flex">
        <div aria-hidden className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl" />
        <Link href="/" className="flex items-center">
          <Logo className="text-white" />
        </Link>

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold leading-tight">Discover, book, and host unforgettable events.</h2>
          <div className="space-y-4">
            {HIGHLIGHTS.map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <item.icon className="h-5 w-5" />
                </span>
                <p className="text-sm text-white/90">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/60">&copy; {new Date().getFullYear()} Novi Events, Inc.</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-1.5 text-sm text-foreground-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
