import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PaginationProps {
  page: number;
  pageCount: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageCount, totalItems, pageSize, onPageChange }: PaginationProps) {
  if (totalItems === 0) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-muted sm:flex-row">
      <p>
        Showing <span className="font-semibold text-ink">{start}</span>–
        <span className="font-semibold text-ink">{end}</span> of{" "}
        <span className="font-semibold text-ink">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </Button>
        <span className="px-2 text-xs font-semibold text-ink">
          Page {page} of {Math.max(pageCount, 1)}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
