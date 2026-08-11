# Occasio Rebrand — Design Spec

## Purpose

Replace the current placeholder branding ("Novi", stock indigo/amber/teal palette, default Geist type) with a considered, restrained luxury visual identity across the whole client app: a new brand name, wordmark logo, color system, typography, and a redesigned event card (the highest-traffic component) plus the shared `Button`/`Badge` primitives it depends on.

## Brand name: Occasio

Latin root of "occasion." Chosen over Aureus / Vellum / Marquee for its unique spelling (low collision risk with existing event-platform brands), premium and slightly mysterious sound, and evocative tie to "a special occasion" without being literal about events/venues.

- Replaces "Novi" everywhere it appears as user-facing brand text: header logo, `<title>` metadata in `layout.tsx`, footer, auth pages, README, `package.json` `name` fields (cosmetic only — not npm-published).
- Tagline (optional, used on the hero/landing only): "Occasio — every occasion, curated."

## Logo

Wordmark-only, no icon mark (per user preference — matches how most premium fashion/hospitality brands treat their identity).

- Rendered as text, not an image asset: `occasio` in lowercase, set in the display serif (Fraunces), medium/semibold weight, generous letter-spacing.
- The final **o** is rendered in the champagne gold accent color; the rest of the wordmark uses the current foreground color (navy in light mode, cream in dark mode).
- Implemented as a small reusable `Logo` component (e.g. `src/components/layout/Logo.tsx`) used in the header, footer, and auth pages — no SVG/image pipeline needed, it stays crisp at any size and switches color automatically with the theme.

## Color system

Guiding principle from luxury web design research: fewer colors, tighter contrast, restraint. The champagne gold accent must never fill large areas — reserved for CTAs, price tags, ratings, active states, and the logo's final letter.

Existing three-token architecture (`primary` / `accent` / `teal`→neutral, each a 50–900 Tailwind-style ramp) is kept as-is structurally (established in a prior session) — this spec only changes *usage rules*, not the token values already in `globals.css`:

| Role | Light mode token | Dark mode token |
|---|---|---|
| Page background | `--background` (Warm Cream `#F8F4F2`) | `--background` (Ink Navy `#020E24`) |
| Card/surface | `--surface` (White `#FFFFFF`) | `--surface` (Dark Navy `#0D1629`) |
| Text | `--foreground` (Ink Navy `#020E24`) | `--foreground` (Cream `#F8F4F2`) |
| Muted text | `--foreground-muted` (`#686A74`) | `--foreground-muted` (`#A3A4AA`) |
| Border (hairline) | `--border-color` (`#DDD3C2`) | `--border-color` (`#35343B`) |
| Accent (sparingly) | `--color-accent-500/600/700` (gold ramp) | same |

Usage rules to apply consistently across components touched by this rebrand:
- Gold (`accent-*`) is used for: outlined CTA borders/hover fills, price text, star ratings, active nav/tab underlines, the logo's final letter. Never as a full-bleed background or large filled block.
- Navy (`primary-*`) is used for: solid text, dark surfaces, hero sections, and — only where a *solid* filled CTA is truly warranted (e.g. a final confirm/pay action) — a solid navy button.
- Functional colors (error red, success green, warning amber from default Tailwind palette) are unchanged — out of scope, they're status colors, not brand colors.

## Typography

Loaded via `next/font/google` in `layout.tsx`, replacing the current `Geist` / `Geist_Mono`:

- **Display — Fraunces**: headlines (`h1`/`h2`), hero copy, section titles, event titles on cards, and the logo wordmark. Chosen over the more generic Playfair Display for its warmer, more characterful soft-serif letterforms.
- **Body/UI — Manrope**: nav, buttons, form fields, body copy, dashboard tables, badges. Replaces Geist Sans as the default body font.
- `Geist_Mono` is dropped — grepping the codebase shows `--font-mono` is declared in `globals.css` but no component actually applies `font-mono`, so it's dead weight.
- New CSS variables: `--font-display` (Fraunces) and `--font-sans` (Manrope), wired the same way the existing `--font-geist-sans` is today.

## Card redesign: `EventCard.tsx`

Current: `rounded-2xl` + visible border + `shadow-sm`, solid-color `Badge` overlays for Featured/Sold Out/Price, filled category badge chip, sans-serif title, solid `bg-primary-600` "View Details" pill.

New:
- Radius tightened to `rounded-xl` (from `2xl`) — more tailored, less "app bubble."
- Border becomes a single hairline (`border-border`), shadow removed at rest and only appears on hover (soft, not heavy) — restraint over decoration.
- Featured/Sold Out/Price overlay badges become frosted-glass pills over the photo: `bg-black/35 backdrop-blur-sm text-cream-50` (or theme-appropriate equivalent), replacing the current solid `Badge` colors for these three specifically. Price text specifically rendered in gold.
- Category label changes from a filled `Badge` chip to a small uppercase, letter-spaced "eyebrow" text label in a muted gold tone — no background chip.
- Event title (`h3`) switches from the default sans to `font-display` (Fraunces).
- Star rating icon and the date/location icons switch from plain muted gray to gold tint, giving a consistent thread of the accent color through the card.
- "View Details" changes from a solid `bg-primary-600` filled pill to a thin gold-outlined pill (`border border-accent-500 text-accent-700`) that fills gold on hover (`hover:bg-accent-500 hover:text-primary-900`) — this becomes the standard treatment for primary actions, not just this card.

## Shared primitives: `Button.tsx` and `Badge.tsx`

Both are used by ~39 files across the app, so the card's visual language only reads as "the app's design" if these two components carry it everywhere, not just on the card:

- `Button.tsx`: the "primary" variant adopts the same gold-outline-fills-on-hover treatment as the card's CTA. A true solid-filled variant remains available (navy-filled) for the rare case where a page needs one dominant, unambiguous action (e.g. final booking confirmation) — existing variant names/props are kept, only the visual treatment of the existing `primary` variant changes.
- `Badge.tsx`: existing `tone` props (`primary` / `accent` / `neutral` / `danger`) are kept; only the rendering for `accent`-toned badges is revisited to match the new restrained gold usage (text-forward, not a solid gold fill) where it makes sense — `danger` (error/status) badges are unaffected.

Functional/status coloring elsewhere in the app (form error banners, red/green booking-status badges, etc.) is out of scope — this rebrand only touches brand-identity color usage, not status semantics.

## Out of scope

- No new icon/mark alongside the wordmark (explicitly declined).
- No changes to the Postgres schema, API, or any business logic — this is a client-side visual/branding change only.
- No change to functional status colors (error/success/warning).
- Dashboard chart colors (recharts) are not addressed here — a future pass could theme them to match, but it's not part of this spec.
