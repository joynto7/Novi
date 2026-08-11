"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { ApiRequestError } from "@/context/AuthContext";
import api from "@/lib/api";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { contactSchema, ContactValues } from "@/lib/validation";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactValues) => {
    setFormError("");
    try {
      await api.post("/contact", values);
      setSubmitted(true);
      reset();
    } catch (err) {
      setFormError(err instanceof ApiRequestError ? err.message : "Could not send your message. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Get in touch</h1>
        <p className="mt-3 text-foreground-muted">Questions, feedback, or partnership ideas — we&apos;d love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="flex items-start gap-3 p-5">
            <Mail className="h-5 w-5 shrink-0 text-primary-600" />
            <div>
              <p className="text-sm font-semibold text-foreground">Email</p>
              <p className="text-sm text-foreground-muted">hello@occasio.events</p>
            </div>
          </Card>
          <Card className="flex items-start gap-3 p-5">
            <Phone className="h-5 w-5 shrink-0 text-primary-600" />
            <div>
              <p className="text-sm font-semibold text-foreground">Phone</p>
              <p className="text-sm text-foreground-muted">+1 (555) 010-2938</p>
            </div>
          </Card>
          <Card className="flex items-start gap-3 p-5">
            <MapPin className="h-5 w-5 shrink-0 text-primary-600" />
            <div>
              <p className="text-sm font-semibold text-foreground">Office</p>
              <p className="text-sm text-foreground-muted">148 Market Street, San Francisco, CA</p>
            </div>
          </Card>
        </div>

        <Card className="p-6 lg:col-span-3">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-teal-500" />
              <h2 className="text-lg font-semibold text-foreground">Message sent!</h2>
              <p className="max-w-sm text-sm text-foreground-muted">
                Thanks for reaching out — our team will get back to you within one business day.
              </p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Full name" required error={errors.name?.message} {...register("name")} />
                <Input label="Email" type="email" required error={errors.email?.message} {...register("email")} />
              </div>
              <Input label="Subject" required error={errors.subject?.message} {...register("subject")} />
              <Textarea
                label="Message"
                required
                hint="At least 10 characters"
                error={errors.message?.message}
                {...register("message")}
              />

              {formError && (
                <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                  {formError}
                </p>
              )}

              <Button type="submit" loading={isSubmitting}>
                Send Message
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
