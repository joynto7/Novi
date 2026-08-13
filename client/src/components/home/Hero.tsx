"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const SLIDE_DURATION_MS = 10000;

const HERO_SLIDES = [
  { label: "Music", video: "https://videos.pexels.com/video-files/9481012/9481012-uhd_2560_1440_24fps.mp4" },
  { label: "Technology", video: "https://videos.pexels.com/video-files/6804109/6804109-uhd_2732_1440_25fps.mp4" },
  { label: "Business", video: "https://videos.pexels.com/video-files/6774633/6774633-uhd_2560_1440_30fps.mp4" },
  { label: "Arts & Culture", video: "https://videos.pexels.com/video-files/6214422/6214422-uhd_2560_1440_25fps.mp4" },
  { label: "Sports", video: "https://videos.pexels.com/video-files/6070825/6070825-uhd_2560_1440_24fps.mp4" },
  { label: "Food & Drink", video: "https://videos.pexels.com/video-files/8626269/8626269-uhd_2560_1440_25fps.mp4" },
  { label: "Wellness", video: "https://videos.pexels.com/video-files/7521693/7521693-hd_1920_1080_25fps.mp4" },
  { label: "Education", video: "https://videos.pexels.com/video-files/8198511/8198511-hd_1920_1080_25fps.mp4" },
];

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [slide, setSlide] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setSlide((i) => (i + 1) % HERO_SLIDES.length);
        setVisible(true);
      }, 400);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  const goToSlide = (i: number) => {
    setVisible(false);
    setTimeout(() => {
      setSlide(i);
      setVisible(true);
    }, 400);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query ? `/events?search=${encodeURIComponent(query)}` : "/events");
  };

  return (
    <section className="relative flex min-h-[62vh] items-center overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 sm:min-h-[68vh]">
      <video
        key={slide}
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        src={HERO_SLIDES[slide].video}
        autoPlay
        loop
        muted
        playsInline
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-primary-700/80 via-primary-600/75 to-teal-600/70" />
      <div
        aria-hidden
        className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-accent-400/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl"
      />

      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 sm:bottom-7">
        <span
          className={`text-xs font-medium tracking-wide text-white/90 transition-opacity duration-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {HERO_SLIDES[slide].label}
        </span>
        <div className="flex items-center gap-1.5">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.label}
              type="button"
              onClick={() => goToSlide(i)}
              aria-label={`Show ${s.label} events`}
              aria-current={i === slide}
              className={`h-1.5 rounded-full transition-all ${
                i === slide ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
          <Sparkles className="h-4 w-4" /> Over 400 events hosted and counting
        </span>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Find your next unforgettable experience
        </h1>
        <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">
          Discover live music, tech summits, food tastings, and community gatherings near you —
          then book your spot in seconds.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-full bg-white p-1.5 shadow-xl dark:bg-surface"
        >
          <Search className="ml-3 h-5 w-5 shrink-0 text-foreground-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, cities, or categories..."
            aria-label="Search events"
            className="h-11 flex-1 bg-transparent px-1 text-sm text-foreground outline-none placeholder:text-foreground-muted/70"
          />
          <Button type="submit" className="shrink-0">
            Search
          </Button>
        </form>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push("/events")}
            className="!bg-white !text-primary-700 hover:!bg-white/90"
          >
            Explore Events <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/register")}
            className="!border-white/40 !text-white hover:!bg-white/10"
          >
            Become an Organizer
          </Button>
        </div>
      </div>
    </section>
  );
}
