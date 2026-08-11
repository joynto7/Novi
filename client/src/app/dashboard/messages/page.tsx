"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Mail, CheckCircle2 } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useToast } from "@/context/ToastContext";
import api from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  resolved: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const { user } = useRequireAuth(["ADMIN"]);
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = () => {
    setLoading(true);
    api
      .get<ApiResponse<ContactMessage[]>>(`/contact?page=${page}&limit=8`)
      .then((res) => {
        setMessages(res.data);
        setTotalPages(res.meta?.totalPages ?? 1);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page]);

  const handleResolve = async (id: string) => {
    try {
      await api.put(`/contact/${id}/resolve`);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, resolved: true } : m)));
      showToast("Marked as resolved.", "success");
    } catch {
      showToast("Could not update message.", "error");
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="mt-1 text-sm text-foreground-muted">Contact form submissions and newsletter signups.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <EmptyState icon={Mail} title="No messages yet" description="Contact form submissions will show up here." />
      ) : (
        <>
          <div className="space-y-3">
            {messages.map((message) => (
              <Card key={message.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{message.subject}</p>
                      <Badge tone={message.resolved ? "teal" : "accent"}>{message.resolved ? "Resolved" : "Open"}</Badge>
                    </div>
                    <p className="text-sm text-foreground-muted">
                      {message.name} &middot; {message.email}
                    </p>
                  </div>
                  <p className="text-xs text-foreground-muted">{format(new Date(message.createdAt), "MMM d, yyyy · h:mm a")}</p>
                </div>
                <p className="mt-3 text-sm text-foreground-muted">{message.message}</p>
                {!message.resolved && (
                  <Button size="sm" variant="outline" className="mt-3" onClick={() => handleResolve(message.id)}>
                    <CheckCircle2 className="h-4 w-4" /> Mark Resolved
                  </Button>
                )}
              </Card>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
