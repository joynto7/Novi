"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Moon, Sun } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useTheme } from "@/context/ThemeContext";
import { ApiRequestError } from "@/context/AuthContext";
import api from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { passwordChangeSchema, PasswordChangeValues } from "@/lib/validation";

export default function SettingsPage() {
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeValues>({ resolver: zodResolver(passwordChangeSchema) });

  const onSubmit = async (values: PasswordChangeValues) => {
    try {
      await api.put("/auth/change-password", values);
      showToast("Password updated successfully.", "success");
      reset();
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Could not update password.", "error");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-foreground-muted">Manage your security and appearance preferences.</p>
      </div>

      <Card className="p-6">
        <h2 className="mb-1 text-base font-semibold text-foreground">Appearance</h2>
        <p className="mb-4 text-sm text-foreground-muted">Choose how Novi looks on this device.</p>
        <div className="flex items-center justify-between rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            {theme === "dark" ? <Moon className="h-5 w-5 text-primary-600" /> : <Sun className="h-5 w-5 text-accent-500" />}
            <div>
              <p className="text-sm font-medium text-foreground">{theme === "dark" ? "Dark mode" : "Light mode"}</p>
              <p className="text-xs text-foreground-muted">Toggle between light and dark themes</p>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={toggleTheme}>
            Switch to {theme === "dark" ? "Light" : "Dark"}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-1 text-base font-semibold text-foreground">Change Password</h2>
        <p className="mb-4 text-sm text-foreground-muted">Update your password to keep your account secure.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Current password"
            type="password"
            required
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <Input
            label="New password"
            type="password"
            required
            hint="At least 6 characters"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <Input
            label="Confirm new password"
            type="password"
            required
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Button type="submit" loading={isSubmitting}>
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
}
