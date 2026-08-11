"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Ticket } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ApiRequestError } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { EventDetail } from "@/lib/types";

export function BookingWidget({ event }: { event: EventDetail }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const seatsLeft = event.capacity - event.seatsBooked;
  const isSoldOut = seatsLeft <= 0;
  const isPast = new Date(event.startDate) < new Date();
  const total = event.price * quantity;

  const handleBook = async () => {
    if (!user) {
      router.push(`/login?redirect=/events/${event.slug}`);
      return;
    }

    setLoading(true);
    try {
      await api.post("/bookings", { eventId: event.id, quantity });
      showToast(`Booked ${quantity} ${quantity > 1 ? "tickets" : "ticket"} for ${event.title}!`, "success");
      router.push("/dashboard/my-bookings");
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Booking failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-foreground">
          {event.price === 0 ? "Free" : `$${event.price}`}
        </span>
        {event.price > 0 && <span className="text-sm text-foreground-muted">per ticket</span>}
      </div>

      <p className="mt-1.5 text-sm text-foreground-muted">
        {isPast ? "This event has ended" : isSoldOut ? "Sold out" : `${seatsLeft} seats left`}
      </p>

      {!isPast && !isSoldOut && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-border p-1.5">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted hover:bg-surface-muted disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-foreground">{quantity} ticket{quantity > 1 ? "s" : ""}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(seatsLeft, q + 1))}
            disabled={quantity >= seatsLeft}
            aria-label="Increase quantity"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted hover:bg-surface-muted disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}

      {!isPast && !isSoldOut && event.price > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
          <span className="text-foreground-muted">Total</span>
          <span className="font-semibold text-foreground">${total.toFixed(2)}</span>
        </div>
      )}

      <Button
        onClick={handleBook}
        loading={loading}
        disabled={isSoldOut || isPast}
        fullWidth
        size="lg"
        className="mt-5"
      >
        <Ticket className="h-4 w-4" />
        {isPast ? "Event ended" : isSoldOut ? "Sold out" : user ? "Book Now" : "Log in to Book"}
      </Button>
    </div>
  );
}
