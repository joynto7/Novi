"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, ApiRequestError } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerSchema, RegisterValues } from "@/lib/validation";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterValues) => {
    setFormError("");
    try {
      await registerUser(values.name, values.email, values.password);
      showToast("Account created! Welcome to Novi.", "success");
      router.push("/dashboard");
    } catch (err) {
      setFormError(err instanceof ApiRequestError ? err.message : "Unable to create account. Please try again.");
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Join Novi to book and manage your events in one place.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input label="Full name" required autoComplete="name" error={errors.name?.message} {...register("name")} />
        <Input label="Email" type="email" required autoComplete="email" error={errors.email?.message} {...register("email")} />
        <Input
          label="Password"
          type="password"
          required
          autoComplete="new-password"
          hint="At least 6 characters"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm password"
          type="password"
          required
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {formError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
            {formError}
          </p>
        )}

        <Button type="submit" fullWidth loading={isSubmitting}>
          Create Account
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-foreground-muted">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton label="Sign up with Google" />

      <p className="mt-6 text-center text-sm text-foreground-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
