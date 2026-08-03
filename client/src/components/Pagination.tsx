import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <nav
      className="flex items-center gap-1"
      aria-label="Pagination"
    >
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 text-slate-500 transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {getPages().map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="flex items-center justify-center h-9 w-9 text-slate-400 text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            aria-current={currentPage === page ? "page" : undefined}
            className={`flex items-center justify-center h-9 w-9 rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              currentPage === page
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                : "border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 text-slate-500 transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
