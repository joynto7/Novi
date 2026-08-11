"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { UserMenu } from "@/components/layout/UserMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Logo } from "@/components/layout/Logo";
import { PageSpinner } from "@/components/ui/Spinner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useRequireAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading || !user) {
    return <PageSpinner label="Loading your dashboard..." />;
  }

  return (
    <div className="flex min-h-screen bg-surface-muted/30">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-surface lg:block">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Logo />
        </div>
        <Sidebar role={user.role} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-surface shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-border px-5 font-bold text-foreground">
              <Link href="/" className="flex items-center">
                <Logo />
              </Link>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar role={user.role} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground-muted hover:bg-surface-muted lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="text-sm font-medium text-foreground-muted hover:text-foreground">
            &larr; Back to site
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
