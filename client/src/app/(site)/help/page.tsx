"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, LifeBuoy, CreditCard, CalendarCheck, UserCog, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const TOPICS = [
  {
    icon: CalendarCheck,
    title: "Booking & Tickets",
    items: [
      {
        q: "How do I book tickets for an event?",
        a: "Open the event's details page, choose your ticket quantity in the booking panel, and click Book Now. If you're not signed in, you'll be prompted to log in first.",
      },
      {
        q: "Can I change the quantity after booking?",
        a: "Not directly — please contact us through the Contact page with your booking details and we'll help adjust it manually.",
      },
      {
        q: "What if an event is sold out?",
        a: "Sold-out events are marked clearly on the listing and details pages. Check the Related Events section for similar options.",
      },
    ],
  },
  {
    icon: CreditCard,
    title: "Payments & Refunds",
    items: [
      {
        q: "What payment methods are supported?",
        a: "This demo environment simulates bookings without processing real payments. In production, Novi would integrate a payment provider like Stripe.",
      },
      {
        q: "How do refunds work?",
        a: "Refund eligibility depends on each event's individual policy, listed on the event's details page. Reach out via Contact for help with a specific booking.",
      },
    ],
  },
  {
    icon: UserCog,
    title: "Account & Access",
    items: [
      {
        q: "How do I reset my password?",
        a: "Head to Dashboard > Settings while logged in to update your password. If you're locked out, contact support for help.",
      },
      {
        q: "How do I become an event organizer?",
        a: "Create a free account, then reach out through Contact to request organizer access for your account.",
      },
    ],
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);

  const filteredTopics = TOPICS.map((topic) => ({
    ...topic,
    items: topic.items.filter(
      (item) =>
        !query ||
        item.q.toLowerCase().includes(query.toLowerCase()) ||
        item.a.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((topic) => topic.items.length > 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
          <LifeBuoy className="h-7 w-7" />
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Help & Support</h1>
        <p className="mt-3 text-foreground-muted">Find answers to common questions, or reach out to our team.</p>

        <div className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-foreground-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search help articles..."
            aria-label="Search help articles"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-muted/70"
          />
        </div>
      </div>

      <div className="mt-12 space-y-10">
        {filteredTopics.length === 0 ? (
          <p className="text-center text-sm text-foreground-muted">No help articles match your search.</p>
        ) : (
          filteredTopics.map((topic) => (
            <div key={topic.title}>
              <div className="mb-4 flex items-center gap-2.5">
                <topic.icon className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-foreground">{topic.title}</h2>
              </div>
              <div className="space-y-3">
                {topic.items.map((item) => {
                  const key = `${topic.title}-${item.q}`;
                  const isOpen = openKey === key;
                  return (
                    <div key={key} className="overflow-hidden rounded-xl border border-border bg-surface">
                      <button
                        onClick={() => setOpenKey(isOpen ? null : key)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      >
                        <span className="text-sm font-medium text-foreground">{item.q}</span>
                        <ChevronDown className={cn("h-5 w-5 shrink-0 text-foreground-muted transition-transform", isOpen && "rotate-180")} />
                      </button>
                      {isOpen && <p className="border-t border-border px-5 py-4 text-sm text-foreground-muted">{item.a}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-14 rounded-2xl border border-border bg-surface-muted/50 p-8 text-center">
        <h2 className="text-lg font-semibold text-foreground">Still need help?</h2>
        <p className="mt-2 text-sm text-foreground-muted">Our support team typically responds within one business day.</p>
        <Link href="/contact" className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700">
          Contact Support &rarr;
        </Link>
      </div>
    </div>
  );
}
