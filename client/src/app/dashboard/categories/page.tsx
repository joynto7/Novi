"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Tag } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useToast } from "@/context/ToastContext";
import { ApiRequestError } from "@/context/AuthContext";
import api from "@/lib/api";
import { ApiResponse, Category } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";

export default function ManageCategoriesPage() {
  useRequireAuth(["ADMIN"]);
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("layers");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const load = () => {
    setLoading(true);
    api
      .get<ApiResponse<Category[]>>("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => showToast("Could not load categories.", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) {
      setError("Category name must be at least 2 characters.");
      return;
    }
    setCreating(true);
    try {
      await api.post("/categories", { name, icon });
      setName("");
      showToast("Category created.", "success");
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not create category.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/categories/${deleteTarget.id}`);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast("Category deleted.", "success");
    } catch {
      showToast("Could not delete category. It may still have events assigned.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Categories</h1>
        <p className="mt-1 text-sm text-foreground-muted">Organize events into browsable categories.</p>
      </div>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Add a new category</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input label="Name" placeholder="e.g. Comedy" value={name} onChange={(e) => setName(e.target.value)} error={error} />
          </div>
          <div className="w-full sm:w-48">
            <Input label="Icon key" placeholder="e.g. music" value={icon} onChange={(e) => setIcon(e.target.value)} />
          </div>
          <Button type="submit" loading={creating}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </form>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState icon={Tag} title="No categories yet" description="Add your first category above." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-foreground">{category.name}</p>
                <p className="text-xs text-foreground-muted">{category._count?.events ?? 0} events</p>
              </div>
              <button
                onClick={() => setDeleteTarget(category)}
                aria-label="Delete category"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete category?">
        <p className="text-sm text-foreground-muted">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
