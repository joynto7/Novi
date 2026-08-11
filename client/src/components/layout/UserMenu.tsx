"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, User as UserIcon, Settings, LogOut, Ticket } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Avatar } from "@/components/ui/Avatar";

export function UserMenu() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    showToast("You have been logged out.", "info");
    router.push("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-2.5 hover:bg-surface-muted"
      >
        <Avatar src={user.avatar} name={user.name} size={32} />
        <span className="hidden max-w-24 truncate text-sm font-medium sm:inline">{user.name.split(" ")[0]}</span>
        <ChevronDown className="h-4 w-4 text-foreground-muted" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-lg animate-fade-in-up"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
            <p className="truncate text-xs text-foreground-muted">{user.email}</p>
          </div>
          <nav className="flex flex-col p-1.5 text-sm">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-surface-muted"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <Link
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-surface-muted"
            >
              <UserIcon className="h-4 w-4" /> Profile
            </Link>
            {user.role === "USER" && (
              <Link
                href="/dashboard/my-bookings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-surface-muted"
              >
                <Ticket className="h-4 w-4" /> My Bookings
              </Link>
            )}
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-surface-muted"
            >
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </nav>
          <div className="border-t border-border p-1.5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
