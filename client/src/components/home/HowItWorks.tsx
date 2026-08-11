import { Search, TicketCheck, PartyPopper } from "lucide-react";
import { SectionHeader } from "@/components/home/SectionHeader";

const STEPS = [
  {
    icon: Search,
    title: "Discover",
    description:
      "Browse curated events by category, price, and date, or search for something specific happening near you.",
  },
  {
    icon: TicketCheck,
    title: "Book instantly",
    description:
      "Reserve your spot in a few clicks with instant confirmation and a clear breakdown of pricing.",
  },
  {
    icon: PartyPopper,
    title: "Attend & share",
    description:
      "Show up, enjoy the experience, and leave a review to help other attendees decide what's next.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Simple by design" title="How Occasio works" align="center" />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <div key={step.title} className="relative flex flex-col items-center text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white">
              <step.icon className="h-7 w-7" />
            </span>
            <span className="absolute -top-2 right-1/2 translate-x-10 text-5xl font-bold text-surface-muted">
              {i + 1}
            </span>
            <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
            <p className="mt-2 max-w-xs text-sm text-foreground-muted">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
