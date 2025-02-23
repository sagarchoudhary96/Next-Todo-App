import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoreHorizontalIcon } from "lucide-react";

const getPageNumbers = (totalPages: number, currentPage: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages];
  } else if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  } else {
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  }
};

const PaginationPageButtons = ({
  totalPages,
  currentPage,
  onChange,
  className,
}: {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {getPageNumbers(totalPages, currentPage).map((page, index) =>
        page === "..." ? (
          <Button
            key={`${index}-pagination-separator`}
            variant="outline"
            onClick={() =>
              onChange(
                index < 3
                  ? Math.max(currentPage - 3, 1)
                  : Math.min(currentPage + 3, totalPages)
              )
            }
          >
            <MoreHorizontalIcon />
          </Button>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onChange(page as number)}
          >
            {page}
          </Button>
        )
      )}
    </div>
  );
};

export default PaginationPageButtons;
