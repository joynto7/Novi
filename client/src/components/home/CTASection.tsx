import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-surface-muted/60 px-6 py-16 text-center">
        <h2 className="max-w-xl text-2xl font-bold text-foreground sm:text-3xl">
          Ready to host your own event?
        </h2>
        <p className="max-w-md text-sm text-foreground-muted">
          Join hundreds of organizers using Novi to manage bookings, track attendance, and grow their
          audience.
        </p>
        <Link href="/register">
          <Button size="lg">
            Get started for free <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
