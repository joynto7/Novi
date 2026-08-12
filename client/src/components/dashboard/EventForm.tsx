"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { ApiRequestError } from "@/context/AuthContext";
import api from "@/lib/api";
import { ApiResponse, Category } from "@/lib/types";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { eventFormSchema, EventFormValues } from "@/lib/validation";

interface EventFormProps {
  mode: "create" | "edit";
  eventId?: string;
  defaultValues?: Partial<EventFormValues> & { images?: string[] };
}

const toInputDateTime = (value?: string) => (value ? new Date(value).toISOString().slice(0, 16) : "");

export function EventForm({ mode, eventId, defaultValues }: EventFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      ...defaultValues,
      startDate: toInputDateTime(defaultValues?.startDate),
      endDate: toInputDateTime(defaultValues?.endDate),
    },
  });

  useEffect(() => {
    api
      .get<ApiResponse<Category[]>>("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => undefined);
  }, []);

  const onSubmit = async (values: EventFormValues) => {
    const payload = {
      ...values,
      images: defaultValues?.images?.length
        ? defaultValues.images
        : [
            "https://images.unsplash.com/photo-1752159684779-0639174cdfac?w=3840&q=80&fm=jpg&fit=crop",
            "https://images.unsplash.com/photo-1758873269013-d914addd5d3b?w=3840&q=80&fm=jpg&fit=crop",
          ],
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
    };

    try {
      if (mode === "create") {
        await api.post("/events", payload);
        showToast("Event created successfully.", "success");
      } else {
        await api.put(`/events/${eventId}`, payload);
        showToast("Event updated successfully.", "success");
      }
      router.push("/dashboard/events");
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Could not save event.", "error");
    }
  };

  return (
    <Card className="max-w-3xl p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Title" required error={errors.title?.message} {...register("title")} />

        <Select label="Category" required error={errors.categoryId?.message} {...register("categoryId")}>
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <Textarea
          label="Short description"
          hint="Shown on event cards. Keep it under 160 characters."
          required
          error={errors.shortDescription?.message}
          {...register("shortDescription")}
        />
        <Textarea label="Overview" required error={errors.overview?.message} {...register("overview")} />
        <Textarea label="Full description" required error={errors.description?.message} {...register("description")} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Location (city/area)" required error={errors.location?.message} {...register("location")} />
          <Input label="Venue" required error={errors.venue?.message} {...register("venue")} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Start date & time" type="datetime-local" required error={errors.startDate?.message} {...register("startDate")} />
          <Input label="End date & time" type="datetime-local" required error={errors.endDate?.message} {...register("endDate")} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Price ($)" type="number" step="0.01" min={0} required error={errors.price?.message} {...register("price")} />
          <Input label="Capacity" type="number" min={1} required error={errors.capacity?.message} {...register("capacity")} />
        </div>

        <Input
          label="Promo video URL (optional)"
          hint="Direct link to an MP4 or embeddable video, shown on the event details page."
          error={errors.videoUrl?.message}
          {...register("videoUrl")}
        />

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" className="h-4 w-4 rounded border-border" {...register("featured")} />
          Mark as featured on the homepage
        </label>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isSubmitting}>
            {mode === "create" ? "Create Event" : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/events")}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
