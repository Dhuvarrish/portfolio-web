"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { api, type Car, type PagedResult } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 8;

const colorMap: Record<string, string> = {
  white: "bg-white border border-border",
  black: "bg-gray-900",
  grey: "bg-gray-400",
  gray: "bg-gray-400",
  silver: "bg-gray-300",
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
};

function ColorDot({ color }: { color: string }) {
  const cls = colorMap[color.toLowerCase()] ?? "bg-muted border border-border";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block size-3 rounded-full ${cls}`} />
      <span className="text-sm">{color}</span>
    </span>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function CarsTable() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [carsResult, setCarsResult] = useState<PagedResult<Car> | null>(null);
  const [carsLoading, setCarsLoading] = useState(true);

  const fetchCars = useCallback(() => {
    setCarsLoading(true);
    api
      .getCars({ search: debouncedSearch, page, pageSize: PAGE_SIZE })
      .then(setCarsResult)
      .catch(console.error)
      .finally(() => setCarsLoading(false));
  }, [debouncedSearch, page]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search make, model, type, colour…"
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Make</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Seats</TableHead>
              <TableHead>Colour</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carsLoading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 rounded bg-muted animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : !carsResult || carsResult.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  No cars match your search.
                </TableCell>
              </TableRow>
            ) : (
              carsResult.items.map((car) => (
                <TableRow key={car.id}>
                  <TableCell className="font-medium">{car.make}</TableCell>
                  <TableCell>{car.model}</TableCell>
                  <TableCell>{car.year}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-background px-2 py-0.5 text-xs ring-1 ring-border text-muted-foreground">
                      {car.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{car.seatCount}</TableCell>
                  <TableCell>
                    <ColorDot color={car.color} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(car.price)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {carsResult && carsResult.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {carsResult.totalCount} result{carsResult.totalCount !== 1 ? "s" : ""} &mdash; page{" "}
            {carsResult.page} of {carsResult.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || carsLoading}
              className="gap-1"
            >
              <ChevronLeft className="size-4" />
              Prev
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: carsResult.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  disabled={carsLoading}
                  className={`h-8 w-8 rounded-md text-xs font-medium transition-colors ${
                    p === page
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(carsResult.totalPages, p + 1))}
              disabled={page === carsResult.totalPages || carsLoading}
              className="gap-1"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
