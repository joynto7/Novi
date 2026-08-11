"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";
import { ApiRequestError } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    try {
      await api.post("/contact", {
        name: "Newsletter Subscriber",
        email,
        subject: "Newsletter Signup",
        message: `${email} subscribed to the Novi newsletter from the homepage.`,
      });
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-r from-primary-700 to-teal-600 px-6 py-14 text-center sm:px-16">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white">
          <Mail className="h-6 w-6" />
        </span>
        <h2 className="max-w-lg text-2xl font-bold text-white sm:text-3xl">
          Never miss an event again
        </h2>
        <p className="max-w-md text-sm text-white/85">
          Get a curated digest of upcoming events in your favorite categories, delivered every two weeks.
        </p>

        {status === "success" ? (
          <p className="flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-sm font-medium text-white">
            <CheckCircle2 className="h-5 w-5" /> You&apos;re subscribed! Check your inbox soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                required
                className="h-12 w-full rounded-full border-0 bg-white px-5 text-sm text-foreground outline-none placeholder:text-foreground-muted/70 focus:ring-2 focus:ring-white/50 dark:bg-surface"
              />
              {error && <p className="mt-1.5 text-left text-xs font-medium text-accent-200">{error}</p>}
            </div>
            <Button
              type="submit"
              loading={status === "loading"}
              className="!bg-white !text-primary-700 hover:!bg-white/90"
            >
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
