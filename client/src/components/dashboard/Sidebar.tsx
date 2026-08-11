"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  User,
  Settings,
  Users,
  CalendarRange,
  BarChart3,
  Tags,
  MessageSquare,
  ClipboardList,
  Star,
  LucideIcon,
} from "lucide-react";
import { Role } from "@/lib/types";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  USER: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/my-bookings", label: "My Bookings", icon: Ticket },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ],
  ORGANIZER: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/events", label: "My Events", icon: CalendarRange },
    { href: "/dashboard/bookings", label: "Bookings", icon: ClipboardList },
    { href: "/dashboard/reviews", label: "Reviews", icon: Star },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ],
  ADMIN: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/events", label: "Manage Events", icon: CalendarRange },
    { href: "/dashboard/bookings", label: "Bookings", icon: ClipboardList },
    { href: "/dashboard/categories", label: "Categories", icon: Tags },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ],
};

export function Sidebar({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      {items.map((item) => {
        const isActive = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary-600 text-white"
                : "text-foreground-muted hover:bg-surface-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
