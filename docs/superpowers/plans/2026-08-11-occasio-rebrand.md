# Occasio Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "Novi" placeholder brand with "Occasio" across the client app — new wordmark logo, restrained navy/gold/cream color usage, Fraunces + Manrope typography, and a redesigned `EventCard` plus the shared `Button`/`Badge` primitives it depends on.

**Architecture:** Pure frontend visual change inside `client/`. No API, schema, or business-logic changes. Color *values* (the `primary`/`accent`/`teal` CSS-variable ramps in `globals.css`) were already set in a prior session — this plan changes *usage* (which component gets which token) plus typography, brand text, and one component's markup/structure.

**Tech Stack:** Next.js 16 (App Router, Turbopack), Tailwind CSS v4 (`@theme inline` CSS-variable driven), `next/font/google`, `lucide-react` icons, `clsx` via `src/lib/cn.ts`.

## Global Constraints

- Brand name is **Occasio** (lowercase in the wordmark: `occasio`), replacing every user-facing and internal occurrence of "Novi".
- Logo is a **wordmark only** — no icon/symbol. Remove the existing `PartyPopper` icon badges everywhere they currently sit next to the "Novi" text.
- Gold (`accent-*` tokens) must never be a large solid fill — only outlines, small pills/text, icons, and hover fills. Navy (`primary-*`) is the dominant surface/text color.
- No test framework exists in this repo (verified: no `*.test.*` files, no test script in `client/package.json`). Verification for every task is: `npm run build` (catches TypeScript/ESLint/Next.js errors) run from `client/`, plus a manual visual check at a named URL with the dev server running (`npm run dev`, http://localhost:3000).
- Functional/status colors (red = danger/error, the default Tailwind palette used for `Badge tone="danger"` and form error states) are **out of scope** — do not touch them.
- Root `package.json`/`client/package.json`/`server/package.json` `"name"` fields are already `"client"`/`"server"`/(root has none) — not "novi" — no change needed there.

---

### Task 1: Typography — Fraunces (display) + Manrope (body), drop unused Geist Mono

**Files:**
- Modify: `client/src/app/layout.tsx`
- Modify: `client/src/app/globals.css`

**Interfaces:**
- Produces: Tailwind utility classes `font-sans` (now Manrope, applied automatically to `body` via Tailwind's preflight default) and `font-display` (Fraunces, must be applied explicitly via `className="font-display"` where used — it is NOT automatic). Later tasks (Logo, EventCard) use `font-display` by this exact class name.

- [ ] **Step 1: Swap the font loaders in `layout.tsx`**

In `client/src/app/layout.tsx`, replace:

```tsx
import { Geist, Geist_Mono } from "next/font/google";
```

```tsx
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

with:

```tsx
import { Fraunces, Manrope } from "next/font/google";
```

```tsx
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});
```

Then update the `<html>` tag's `className`, replacing:

```tsx
<html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
```

with:

```tsx
<html lang="en" className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}>
```

- [ ] **Step 2: Update the theme font variables in `globals.css`**

In `client/src/app/globals.css`, inside the `@theme inline { ... }` block, replace:

```css
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
```

with:

```css
  --font-sans: var(--font-manrope);
  --font-display: var(--font-fraunces);
```

(This drops `--font-mono` entirely — grep confirms no component in `src/` applies the `font-mono` utility class, so it was dead weight.)

- [ ] **Step 3: Add global heading styling**

Still in `globals.css`, add this rule near the bottom (after the `body`/`*`/`::selection` rules, before the `@keyframes` section):

```css
h1,
h2 {
  font-family: var(--font-display);
}
```

This covers every page headline and section title in the app (all use `<h1>`/`<h2>`) without having to touch 20+ page files individually. `<h3>` is deliberately left alone here — it's used for small UI chrome (dashboard widget labels, footer link-group titles) that should stay in the body sans; the one h3 that should be serif (the `EventCard` title) gets an explicit `font-display` class in Task 6.

- [ ] **Step 4: Verify the build**

Run: `cd client && npm run build`
Expected: build completes with no TypeScript/lint errors.

- [ ] **Step 5: Visual check**

Run `npm run dev`, open http://localhost:3000. Confirm: page headings (e.g. the hero "Discover, book, and host unforgettable events" style copy) render in a serif face, body text/nav/buttons render in a clean sans-serif (not the old Geist).

- [ ] **Step 6: Commit**

```bash
git add client/src/app/layout.tsx client/src/app/globals.css
git commit -m "Swap Geist for Fraunces (display) + Manrope (body), drop unused Geist Mono"
```

---

### Task 2: Logo component

**Files:**
- Create: `client/src/components/layout/Logo.tsx`
- Modify: `client/src/components/layout/Navbar.tsx`
- Modify: `client/src/components/layout/Footer.tsx`
- Modify: `client/src/components/auth/AuthShell.tsx`
- Modify: `client/src/app/dashboard/layout.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/cn` (existing utility: `cn(...inputs: ClassValue[]) => string`), `font-display` utility class from Task 1.
- Produces: `Logo({ className }: { className?: string })` — a React component rendering the wordmark. No other component in this codebase currently exports anything named `Logo`.

- [ ] **Step 1: Create the Logo component**

Create `client/src/components/layout/Logo.tsx`:

```tsx
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-lg font-semibold tracking-tight text-foreground", className)}>
      occasi<span className="text-accent-500">o</span>
    </span>
  );
}
```

- [ ] **Step 2: Use it in the Navbar**

In `client/src/components/layout/Navbar.tsx`:
- Remove `PartyPopper` from the `lucide-react` import (it's only used for the logo icon in this file — confirm with `grep -n PartyPopper client/src/components/layout/Navbar.tsx` before removing, it should show exactly the import line and one usage).
- Add `import { Logo } from "@/components/layout/Logo";` near the top.
- Replace:

```tsx
<Link href="/" className="flex items-center gap-2 font-bold text-foreground">
  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
    <PartyPopper className="h-5 w-5" />
  </span>
  <span className="text-lg">Novi</span>
</Link>
```

with:

```tsx
<Link href="/" className="flex items-center text-foreground">
  <Logo />
</Link>
```

- [ ] **Step 3: Use it in the Footer**

In `client/src/components/layout/Footer.tsx`:
- Remove `PartyPopper` from the `lucide-react` import (keep `Mail, MapPin, Phone`).
- Add `import { Logo } from "@/components/layout/Logo";`.
- Replace:

```tsx
<Link href="/" className="flex items-center gap-2 font-bold text-foreground">
  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
    <PartyPopper className="h-5 w-5" />
  </span>
  <span className="text-lg">Novi</span>
</Link>
```

with:

```tsx
<Link href="/" className="flex items-center text-foreground">
  <Logo />
</Link>
```

- [ ] **Step 4: Use it in AuthShell**

In `client/src/components/auth/AuthShell.tsx`:
- Remove `PartyPopper` from the `lucide-react` import (keep `CalendarCheck, ShieldCheck, Sparkles`).
- Add `import { Logo } from "@/components/layout/Logo";`.
- Replace:

```tsx
<Link href="/" className="flex items-center gap-2 text-lg font-bold">
  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
    <PartyPopper className="h-5 w-5" />
  </span>
  Novi
</Link>
```

with:

```tsx
<Link href="/" className="flex items-center">
  <Logo className="text-white" />
</Link>
```

(The `text-white` override is needed here specifically because this panel has a dark navy gradient background regardless of light/dark theme, so the logo can't rely on the theme-driven `text-foreground` default.)

Also replace the copyright line's brand name later in Task 3 (it's plain text there, not part of the logo lockup) — don't touch it in this task.

- [ ] **Step 5: Use it in the dashboard layout (desktop + mobile sidebar)**

In `client/src/app/dashboard/layout.tsx`:
- Remove `PartyPopper` from the `lucide-react` import, keep `Menu, X`.
- Add `import { Logo } from "@/components/layout/Logo";`.
- Replace (desktop sidebar):

```tsx
<div className="flex h-16 items-center gap-2 border-b border-border px-5 font-bold text-foreground">
  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
    <PartyPopper className="h-4 w-4" />
  </span>
  Novi
</div>
```

with:

```tsx
<div className="flex h-16 items-center border-b border-border px-5">
  <Logo />
</div>
```

- Replace (mobile sidebar overlay):

```tsx
<Link href="/" className="flex items-center gap-2">
  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
    <PartyPopper className="h-4 w-4" />
  </span>
  Novi
</Link>
```

with:

```tsx
<Link href="/" className="flex items-center">
  <Logo />
</Link>
```

- [ ] **Step 6: Verify the build**

Run: `cd client && npm run build`
Expected: build completes with no errors (this also catches any leftover unused `PartyPopper` import you might have missed removing — Next.js's ESLint config flags unused imports).

- [ ] **Step 7: Visual check**

With `npm run dev` running, check http://localhost:3000 (navbar + footer), http://localhost:3000/login (AuthShell panel — confirm the wordmark is legible in white on the dark panel), and http://localhost:3000/dashboard (sidebar, plus resize the browser narrow to trigger the mobile menu and check the mobile sidebar version too). Confirm: no icon box remains anywhere, just the wordmark with the gold final "o".

- [ ] **Step 8: Commit**

```bash
git add client/src/components/layout/Logo.tsx client/src/components/layout/Navbar.tsx client/src/components/layout/Footer.tsx client/src/components/auth/AuthShell.tsx client/src/app/dashboard/layout.tsx
git commit -m "Add Occasio wordmark Logo component, remove PartyPopper icon lockup"
```

---

### Task 3: Rename "Novi" to "Occasio" everywhere else

**Files:**
- Modify: `client/src/app/layout.tsx` (metadata only — title/description)
- Modify: `client/src/components/home/HowItWorks.tsx`
- Modify: `client/src/components/home/FAQSection.tsx`
- Modify: `client/src/components/home/NewsletterSection.tsx`
- Modify: `client/src/components/home/CTASection.tsx`
- Modify: `client/src/components/home/BlogPreview.tsx`
- Modify: `client/src/components/home/Testimonials.tsx`
- Modify: `client/src/components/layout/Footer.tsx` (copyright line only — logo lockup already done in Task 2)
- Modify: `client/src/components/auth/AuthShell.tsx` (copyright line only)
- Modify: `client/src/app/(site)/about/page.tsx`
- Modify: `client/src/app/(site)/privacy/page.tsx`
- Modify: `client/src/app/(site)/help/page.tsx`
- Modify: `client/src/app/(site)/blog/page.tsx`
- Modify: `client/src/app/(site)/register/page.tsx`
- Modify: `client/src/app/dashboard/settings/page.tsx`
- Modify: `server/src/index.js`
- Modify: `server/src/app.js`
- Modify: `README.md`, `client/README.md`, `server/README.md`

**Interfaces:** None — this task only changes string literals, no signatures change.

- [ ] **Step 1: Confirm the exact scope**

Run: `grep -rn "Novi" client/src server/src client/README.md server/README.md README.md`
Expected: exactly the occurrences listed below (every one is a standalone brand-name mention — none are substrings of another word like "Novice", so a plain "Novi" → "Occasio" replacement is always correct):

```
client/src/app/layout.tsx:20:    default: "Novi — Discover & Book Amazing Events",
client/src/app/layout.tsx:21:    template: "%s | Novi",
client/src/app/layout.tsx:24:    "Novi is a modern event platform for discovering, booking, and hosting events — from live music to tech summits.",
client/src/components/home/HowItWorks.tsx:28:  <SectionHeader eyebrow="Simple by design" title="How Novi works" align="center" />
client/src/components/home/FAQSection.tsx:20:    question: "How do I become an event organizer on Novi?",
client/src/components/home/FAQSection.tsx:25:    question: "Is there a fee for using Novi?",
client/src/components/home/FAQSection.tsx:27:    "Browsing and creating a Novi account is completely free. ..."
client/src/components/home/NewsletterSection.tsx:29:  message: `${email} subscribed to the Novi newsletter from the homepage.`,
client/src/components/home/CTASection.tsx:13:  Join hundreds of organizers using Novi to manage bookings, ...
client/src/components/home/BlogPreview.tsx:16:  description="Guides for organizers and attendees alike, straight from the Novi team."
client/src/components/home/Testimonials.tsx:21:  description="Real feedback from real attendees across the events hosted on Novi."
client/src/components/layout/Footer.tsx:101:  <p>&copy; {new Date().getFullYear()} Novi Events, Inc. All rights reserved.</p>
client/src/components/auth/AuthShell.tsx:44:  <p ...>&copy; {new Date().getFullYear()} Novi Events, Inc.</p>
client/src/app/(site)/about/page.tsx:29: "Novi started as a weekend project ..."
client/src/app/(site)/about/page.tsx:42: "Novi is a discovery and booking platform ..."
client/src/app/(site)/about/page.tsx:78: <h2>Want to bring your event to Novi?</h2>
client/src/app/(site)/privacy/page.tsx:8,20,26,43 (four mentions)
client/src/app/dashboard/settings/page.tsx:45: "Choose how Novi looks on this device."
client/src/app/(site)/register/page.tsx:32,40 (two mentions)
client/src/app/(site)/help/page.tsx:33: "... Novi would integrate a payment provider like Stripe."
client/src/app/(site)/blog/page.tsx:35: <h1>The Novi Blog</h1>
server/src/index.js:8: console.log(`Novi API listening on port ${PORT}`);
server/src/app.js:33: res.json({ success: true, message: 'Novi API is running' });
README.md, client/README.md, server/README.md: headings and prose
```

- [ ] **Step 2: Replace every occurrence**

Run from the repo root:

```bash
grep -rl "Novi" client/src server/src client/README.md server/README.md README.md | xargs sed -i '' 's/Novi/Occasio/g'
```

(macOS `sed` requires the empty `''` after `-i`.)

- [ ] **Step 3: Verify no occurrences remain and nothing broke grammatically**

Run: `grep -rn "Novi" client/src server/src client/README.md server/README.md README.md`
Expected: no output.

Then read through the diff (`git diff`) for the four files with the most prose — `client/src/app/(site)/about/page.tsx`, `client/src/app/(site)/privacy/page.tsx`, `client/src/components/home/FAQSection.tsx`, `client/src/components/home/CTASection.tsx` — and confirm every sentence still reads naturally with "Occasio" substituted (e.g. "How do I become an event organizer on Occasio?", "Occasio is a discovery and booking platform..."). All of these were plain brand-name substitutions with no possessive `'s` forms in the original text, so no grammar fixes should be needed — but check `README.md`'s `Novi/` directory-tree line specifically: it must stay as the literal directory name `Novi/` (the repo folder itself isn't being renamed), so revert just that one line back to `Novi/` if `sed` changed it.

- [ ] **Step 4: Verify the build**

Run: `cd client && npm run build`
Expected: build completes with no errors.

- [ ] **Step 5: Visual check**

With `npm run dev` running, check the browser tab title on http://localhost:3000 (should read "Occasio — Discover & Book Amazing Events"), and skim http://localhost:3000/about, http://localhost:3000 (scroll to FAQ/testimonials/newsletter sections), and http://localhost:3000/register to confirm the copy reads correctly.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Rename brand from Novi to Occasio across client, server, and docs"
```

---

### Task 4: Button.tsx — gold-outline primary, navy-solid secondary

**Files:**
- Modify: `client/src/components/ui/Button.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: same exported `Button` component, same `Variant = "primary" | "secondary" | "outline" | "ghost" | "danger"` type and prop names — only the CSS classes for `primary` and `secondary` change. Every one of the ~39 files using `<Button>` is unaffected at the call-site level (no prop renames).

- [ ] **Step 1: Replace the variant classes**

In `client/src/components/ui/Button.tsx`, replace:

```tsx
const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus-visible:outline-primary-600 disabled:bg-primary-300",
  secondary:
    "bg-accent-500 text-white hover:bg-accent-600 focus-visible:outline-accent-500 disabled:bg-accent-200",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-surface-muted focus-visible:outline-primary-600",
  ghost: "bg-transparent text-foreground hover:bg-surface-muted",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600 disabled:bg-red-300",
};
```

with:

```tsx
const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "border border-accent-600 bg-transparent text-accent-700 hover:bg-accent-500 hover:text-primary-900 hover:border-accent-500 focus-visible:outline-accent-500 disabled:border-accent-200 disabled:text-accent-300 dark:border-accent-400 dark:text-accent-400 dark:hover:bg-accent-500 dark:hover:text-primary-900 dark:disabled:border-accent-800 dark:disabled:text-accent-700",
  secondary:
    "bg-primary-800 text-white hover:bg-primary-900 focus-visible:outline-primary-700 disabled:bg-primary-300 dark:bg-primary-600 dark:hover:bg-primary-500",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-surface-muted focus-visible:outline-primary-600",
  ghost: "bg-transparent text-foreground hover:bg-surface-muted",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600 disabled:bg-red-300",
};
```

`primary` (the default, used for most CTAs — "Book Now", "Save", form submits) becomes the restrained gold-outline treatment that fills gold on hover. `secondary` becomes the rare solid-filled navy button, for the handful of places that need one unambiguous, maximum-emphasis action. `outline`/`ghost`/`danger` are unchanged — the spec doesn't call for touching them.

- [ ] **Step 2: Verify the build**

Run: `cd client && npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Visual check**

With `npm run dev` running, check http://localhost:3000/login (the "Log In" submit button uses the default `primary` variant) — confirm it now renders as a gold-outlined pill that fills gold on hover, in both light and dark mode (use the theme toggle in the navbar).

- [ ] **Step 4: Commit**

```bash
git add client/src/components/ui/Button.tsx
git commit -m "Restyle Button primary variant as gold outline, secondary as solid navy"
```

---

### Task 5: Badge.tsx — text-forward accent tone

**Files:**
- Modify: `client/src/components/ui/Badge.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: same exported `Badge` component, same `Tone = "primary" | "accent" | "teal" | "neutral" | "danger"` type and `tone` prop — only the `accent` tone's classes change.

- [ ] **Step 1: Replace the accent tone class**

In `client/src/components/ui/Badge.tsx`, replace:

```tsx
  accent: "bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300",
```

with:

```tsx
  accent: "border border-accent-500 bg-transparent text-accent-700 dark:border-accent-500 dark:text-accent-300",
```

- [ ] **Step 2: Verify the build**

Run: `cd client && npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Visual check**

With `npm run dev` running, check http://localhost:3000/events/[any-event-slug] for an event marked featured (or check http://localhost:3000/events and look at a "Featured" ribbon before Task 6 changes it) — actually, do this check on http://localhost:3000/events/[slug] specifically (the event detail page's "Featured" badge, which is a plain `<Badge tone="accent">` untouched by Task 6). Confirm it now renders as an outlined gold badge, not a filled one.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/ui/Badge.tsx
git commit -m "Restyle Badge accent tone as outlined, not solid-filled"
```

---

### Task 6: EventCard.tsx redesign

**Files:**
- Modify: `client/src/components/events/EventCard.tsx`

**Interfaces:**
- Consumes: `Badge` from `@/components/ui/Badge` (only for the `danger`-toned "Sold Out" badge now — the `Featured` and price badges no longer use `Badge`), `font-display` utility class from Task 1.
- Produces: same exported `EventCard({ event }: { event: EventCardType })` — no prop/signature change, used identically by every page that renders it (event listing, home page, related events).

- [ ] **Step 1: Replace the component body**

Replace the full contents of `client/src/components/events/EventCard.tsx` with:

```tsx
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Star } from "lucide-react";
import { format } from "date-fns";
import { EventCard as EventCardType } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

export function EventCard({ event }: { event: EventCardType }) {
  const seatsLeft = event.capacity - event.seatsBooked;
  const isSoldOut = seatsLeft <= 0;

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={event.images[0]}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {event.featured && (
            <span className="inline-flex items-center rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold text-accent-200 backdrop-blur-sm">
              Featured
            </span>
          )}
          {isSoldOut && <Badge tone="danger">Sold Out</Badge>}
        </div>
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold text-accent-300 backdrop-blur-sm">
            {event.price === 0 ? "Free" : `$${event.price}`}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <p className="w-fit text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
          {event.category.name}
        </p>
        <h3 className="line-clamp-1 font-display text-base font-semibold text-foreground">{event.title}</h3>
        <p className="line-clamp-2 text-sm text-foreground-muted">{event.shortDescription}</p>

        <div className="mt-auto space-y-1.5 pt-2 text-sm text-foreground-muted">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 shrink-0 text-accent-600 dark:text-accent-400" />
            <span>{format(new Date(event.startDate), "MMM d, yyyy · h:mm a")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-accent-600 dark:text-accent-400" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1 text-sm font-medium text-foreground">
            <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
            {event.avgRating > 0 ? event.avgRating.toFixed(1) : "New"}
            {event.reviewCount > 0 && (
              <span className="font-normal text-foreground-muted">({event.reviewCount})</span>
            )}
          </div>
          <span className="rounded-full border border-accent-600 px-4 py-1.5 text-xs font-semibold text-accent-700 transition-colors group-hover:border-accent-500 group-hover:bg-accent-500 group-hover:text-primary-900 dark:border-accent-400 dark:text-accent-400 dark:group-hover:bg-accent-500 dark:group-hover:text-primary-900">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
```

Changes from the original: `rounded-2xl` → `rounded-xl`, dropped the resting `shadow-sm` (shadow now only appears on hover), Featured/Price badges are frosted-glass overlay pills instead of solid `Badge` chips (Sold Out stays a `Badge tone="danger"` — that's a status color, explicitly out of scope for this rebrand), category is a gold eyebrow label instead of a filled chip, the title gets `font-display`, the date/location icons are gold-tinted, and "View Details" is a gold-outline pill matching the new `Button` primary treatment instead of a solid navy fill.

- [ ] **Step 2: Verify the build**

Run: `cd client && npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Visual check**

With `npm run dev` running (and the API server running so events actually load), check http://localhost:3000/events. Confirm: cards have a tighter corner radius, a hairline border with no resting shadow, frosted "Featured"/price pills over the photo, a small gold category label, a serif event title, gold-tinted calendar/location icons, and a gold-outlined "View Details" pill that fills gold on hover. Toggle dark mode and re-check.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/events/EventCard.tsx
git commit -m "Redesign EventCard: tighter radius, frosted overlays, gold accents, serif title"
```

---

### Task 7: Final full-app pass

**Files:** none new — this is a verification-only task.

- [ ] **Step 1: Full build**

Run: `cd client && npm run build && npm run lint`
Expected: both succeed with no errors or warnings.

- [ ] **Step 2: Full grep sweep**

Run: `grep -rn "Novi\|PartyPopper" client/src server/src`
Expected: no output (confirms Task 3's rename and Task 2's icon removal are complete everywhere).

- [ ] **Step 3: Manual walkthrough**

With `npm run dev` (client) and `npm run dev` (server) both running, walk through: home page, `/events`, an event detail page, `/login`, `/register`, `/dashboard` (as any demo role), and the navbar/footer on at least two pages. Toggle light/dark mode at least once during this walkthrough. Confirm nothing regressed (no missing icons, no broken layout, no leftover "Novi" text) and the new identity — Occasio wordmark, navy/gold/cream palette, serif headlines — reads consistently everywhere.

- [ ] **Step 4: Commit (if any stray fixups were needed)**

```bash
git add -A
git commit -m "Fix stray issues found in full-app rebrand walkthrough"
```

(Skip this commit entirely if Step 3 found nothing to fix.)
