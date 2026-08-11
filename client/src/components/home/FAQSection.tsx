"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeader } from "@/components/home/SectionHeader";
import { cn } from "@/lib/cn";

const FAQS = [
  {
    question: "How do I book a spot at an event?",
    answer:
      "Open any event's details page and click \"Book Now\". If you're not logged in yet, you'll be asked to sign in or create a free account first, then you can confirm your quantity and complete the booking instantly.",
  },
  {
    question: "Can I cancel or get a refund for a booking?",
    answer:
      "Yes. Head to your Dashboard > My Bookings to view your upcoming reservations. Refund eligibility depends on the individual event's policy, which is listed on the event's details page.",
  },
  {
    question: "How do I become an event organizer on Novi?",
    answer:
      "Sign up for a free account, then reach out through our Contact page to request organizer access. Once approved, you'll get access to event creation tools and an organizer dashboard.",
  },
  {
    question: "Is there a fee for using Novi?",
    answer:
      "Browsing and creating a Novi account is completely free. Ticket prices are set individually by each event organizer, and some events are free to attend.",
  },
  {
    question: "What happens if an event sells out?",
    answer:
      "Sold out events are clearly marked on both the listing and details pages. You can still browse similar events in the same category from the event's related events section.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Good to know" title="Frequently asked questions" align="center" />
      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question} className="overflow-hidden rounded-xl border border-border bg-surface">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold text-foreground">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-foreground-muted transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              {isOpen && (
                <p className="border-t border-border px-5 py-4 text-sm text-foreground-muted">{faq.answer}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
