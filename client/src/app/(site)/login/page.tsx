"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useAuth, ApiRequestError } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginSchema, LoginValues } from "@/lib/validation";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const { login, demoLogin } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [formError, setFormError] = useState("");
  const [demoLoading, setDemoLoading] = useState<"user" | "admin" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    setFormError("");
    try {
      await login(values.email, values.password);
      showToast("Welcome back!", "success");
      router.push(redirect);
    } catch (err) {
      setFormError(err instanceof ApiRequestError ? err.message : "Unable to log in. Please try again.");
    }
  };

  const handleDemo = async (role: "user" | "admin") => {
    setDemoLoading(role);
    try {
      await demoLogin(role);
      showToast(`Logged in as demo ${role}.`, "success");
      router.push("/dashboard");
    } catch {
      showToast("Demo login is unavailable right now.", "error");
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to manage your bookings and dashboard.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input label="Email" type="email" required autoComplete="email" error={errors.email?.message} {...register("email")} />
        <Input
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        {formError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
            {formError}
          </p>
        )}

        <Button type="submit" fullWidth loading={isSubmitting}>
          Log In
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-foreground-muted">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-2.5">
        <GoogleButton />
        <div className="grid grid-cols-2 gap-2.5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={demoLoading === "user"}
            onClick={() => handleDemo("user")}
          >
            <Sparkles className="h-4 w-4" /> Demo User
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={demoLoading === "admin"}
            onClick={() => handleDemo("admin")}
          >
            <Sparkles className="h-4 w-4" /> Demo Admin
          </Button>
        </div>
        <p className="text-center text-xs text-foreground-muted">
          user@novi.demo / admin@novi.demo &middot; password: Demo@123
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-foreground-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-700">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}
