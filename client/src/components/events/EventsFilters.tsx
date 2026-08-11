"use client";

import { SlidersHorizontal } from "lucide-react";
import { Category } from "@/lib/types";
import { Input, Select } from "@/components/ui/Input";

export interface EventFiltersState {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
}

interface EventsFiltersProps {
  categories: Category[];
  filters: EventFiltersState;
  onChange: (filters: Partial<EventFiltersState>) => void;
}

export function EventsFilters({ categories, filters, onChange }: EventsFiltersProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        <SlidersHorizontal className="h-4 w-4" /> Search & Filter
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Input
            label="Search"
            placeholder="Search events, cities..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </div>

        <Select
          label="Category"
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value })}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>

        <Input
          label="Min price"
          type="number"
          min={0}
          placeholder="$0"
          value={filters.minPrice}
          onChange={(e) => onChange({ minPrice: e.target.value })}
        />

        <Input
          label="Max price"
          type="number"
          min={0}
          placeholder="Any"
          value={filters.maxPrice}
          onChange={(e) => onChange({ maxPrice: e.target.value })}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <Select
          label="Sort by"
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value })}
          className="max-w-xs"
        >
          <option value="startDate_asc">Date: Soonest first</option>
          <option value="startDate_desc">Date: Latest first</option>
          <option value="price_asc">Price: Low to high</option>
          <option value="price_desc">Price: High to low</option>
          <option value="newest">Recently added</option>
        </Select>

        <button
          onClick={() => onChange({ search: "", category: "", minPrice: "", maxPrice: "", sort: "startDate_asc" })}
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
}
