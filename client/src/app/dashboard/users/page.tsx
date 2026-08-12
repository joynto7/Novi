"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Trash2, Users as UsersIcon } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { ApiResponse, Role } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  createdAt: string;
  _count: { bookings: number; eventsOwned: number };
}

export default function ManageUsersPage() {
  const { user: authorizedUser } = useRequireAuth(["ADMIN"]);
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null);

  const debouncedSearch = useDebounce(search, 350);

  const load = () => {
    if (!authorizedUser) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "8" });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (roleFilter) params.set("role", roleFilter);

    api
      .get<ApiResponse<ManagedUser[]>>(`/users?${params.toString()}`)
      .then((res) => {
        setUsers(res.data);
        setTotalPages(res.meta?.totalPages ?? 1);
      })
      .catch(() => showToast("Could not load users.", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [authorizedUser, page, roleFilter, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleRoleChange = async (id: string, role: Role) => {
    try {
      await api.put(`/users/${id}/role`, { role });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      showToast("User role updated.", "success");
    } catch {
      showToast("Could not update role.", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/users/${deleteTarget.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      showToast("User removed.", "success");
    } catch {
      showToast("Could not remove user.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>
        <p className="mt-1 text-sm text-foreground-muted">View, filter, and manage platform users.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All roles</option>
          <option value="USER">User</option>
          <option value="ORGANIZER">Organizer</option>
          <option value="ADMIN">Admin</option>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState icon={UsersIcon} title="No users found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-foreground-muted">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3">Bookings</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={u.avatar} name={u.name} size={36} />
                        <div>
                          <p className="font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-foreground-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-foreground-muted">{format(new Date(u.createdAt), "MMM d, yyyy")}</td>
                    <td className="px-5 py-3 text-foreground-muted">{u._count.bookings}</td>
                    <td className="px-5 py-3">
                      {u.id === currentUser?.id ? (
                        <Badge tone="primary">{u.role} (you)</Badge>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                          className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs font-medium"
                        >
                          <option value="USER">User</option>
                          <option value="ORGANIZER">Organizer</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {u.id !== currentUser?.id && (
                        <button
                          onClick={() => setDeleteTarget(u)}
                          aria-label="Delete user"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove user?">
        <p className="text-sm text-foreground-muted">
          Are you sure you want to remove <strong>{deleteTarget?.name}</strong>? This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Remove
          </Button>
        </div>
      </Modal>
    </div>
  );
}
