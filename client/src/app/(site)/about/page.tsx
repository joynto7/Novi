import Link from "next/link";
import { Target, Users, Globe2, HeartHandshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const VALUES = [
  {
    icon: Target,
    title: "Purposeful experiences",
    description: "We believe great events create real connection, not just filled calendars.",
  },
  {
    icon: Users,
    title: "Community first",
    description: "Organizers and attendees are equal partners in building a trustworthy platform.",
  },
  {
    icon: Globe2,
    title: "Open to everyone",
    description: "From free community meetups to premium summits, every event deserves a stage.",
  },
  {
    icon: HeartHandshake,
    title: "Built on trust",
    description: "Transparent pricing, verified organizers, and real reviews from real attendees.",
  },
];

const TIMELINE = [
  { year: "2022", text: "Novi started as a weekend project to help local organizers fill empty seats." },
  { year: "2023", text: "Expanded into ticketing and reviews after our first 100 organizers asked for it." },
  { year: "2024", text: "Crossed 400 hosted events and launched organizer analytics." },
  { year: "2026", text: "Rebuilt the platform from the ground up for reliability and speed." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">We help great events find great audiences</h1>
          <p className="mt-5 text-lg text-white/85">
            Novi is a discovery and booking platform built for organizers who want less admin and more
            impact, and attendees who want experiences worth their time.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <div key={value.title} className="rounded-2xl border border-border bg-surface p-6">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
                <value.icon className="h-5 w-5" />
              </span>
              <h3 className="text-base font-semibold text-foreground">{value.title}</h3>
              <p className="mt-2 text-sm text-foreground-muted">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-muted/40 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-bold text-foreground">Our journey so far</h2>
          <div className="space-y-8 border-l-2 border-border pl-6">
            {TIMELINE.map((item) => (
              <div key={item.year} className="relative">
                <span className="absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 ring-4 ring-surface-muted" />
                <p className="text-sm font-bold text-primary-600">{item.year}</p>
                <p className="mt-1 text-foreground-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Want to bring your event to Novi?</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-foreground-muted">
          Join our community of organizers and start reaching engaged, local audiences today.
        </p>
        <Link href="/register" className="mt-6 inline-block">
          <Button size="lg">
            Get started <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
