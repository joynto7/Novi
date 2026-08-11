"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { EventCard as EventCardType, Category, BlogPost, Review, ApiResponse } from "@/lib/types";
import { Hero } from "@/components/home/Hero";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { StatsSection } from "@/components/home/StatsSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { BlogPreview } from "@/components/home/BlogPreview";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";

interface TestimonialReview extends Review {
  event: { id: string; title: string; slug: string };
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [featuredEvents, setFeaturedEvents] = useState<EventCardType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<TestimonialReview[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalCategories: 0,
    totalCities: 0,
    totalAttendees: 0,
  });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [eventsRes, allEventsRes, categoriesRes, reviewsRes, postsRes] = await Promise.all([
          api.get<ApiResponse<EventCardType[]>>("/events?featured=true&limit=6"),
          api.get<ApiResponse<EventCardType[]>>("/events?limit=100"),
          api.get<ApiResponse<Category[]>>("/categories"),
          api.get<ApiResponse<TestimonialReview[]>>("/reviews/featured"),
          api.get<ApiResponse<BlogPost[]>>("/blog?limit=3"),
        ]);

        if (!active) return;

        setFeaturedEvents(eventsRes.data);
        setCategories(categoriesRes.data);
        setReviews(reviewsRes.data);
        setPosts(postsRes.data);

        const allEvents = allEventsRes.data;
        const cities = new Set(allEvents.map((e) => e.location.split(",").pop()?.trim()));
        const attendees = allEvents.reduce((sum, e) => sum + e.seatsBooked, 0);

        setStats({
          totalEvents: allEventsRes.meta?.total ?? allEvents.length,
          totalCategories: categoriesRes.data.length,
          totalCities: cities.size,
          totalAttendees: attendees,
        });
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Hero />
      <FeaturedEvents events={featuredEvents} loading={loading} />
      <CategoryGrid categories={categories} loading={loading} />
      <StatsSection stats={stats} />
      <HowItWorks />
      <Testimonials reviews={reviews} loading={loading} />
      <BlogPreview posts={posts} loading={loading} />
      <NewsletterSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
