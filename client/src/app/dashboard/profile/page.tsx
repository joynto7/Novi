"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, ApiRequestError } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import api from "@/lib/api";
import { User } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { profileSchema, ProfileValues } from "@/lib/validation";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (user) reset({ name: user.name, phone: user.phone || "", bio: user.bio || "" });
  }, [user, reset]);

  if (!user) return null;

  const onSubmit = async (values: ProfileValues) => {
    try {
      const res = await api.put<{ data: User }>("/auth/profile", values);
      updateUser(res.data);
      showToast("Profile updated successfully.", "success");
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Could not update profile.", "error");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-foreground-muted">Manage your personal information.</p>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Avatar src={user.avatar} name={user.name} size={64} />
          <div>
            <p className="text-lg font-semibold text-foreground">{user.name}</p>
            <p className="text-sm text-foreground-muted">{user.email}</p>
            <Badge tone="primary" className="mt-1">
              {user.role}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full name" required error={errors.name?.message} {...register("name")} />
          <Input label="Email" value={user.email} disabled hint="Email cannot be changed" />
          <Input label="Phone" placeholder="+1 (555) 000-0000" error={errors.phone?.message} {...register("phone")} />
          <Textarea
            label="Bio"
            placeholder="Tell us a bit about yourself..."
            error={errors.bio?.message}
            {...register("bio")}
          />
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
