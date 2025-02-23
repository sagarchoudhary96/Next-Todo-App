import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePaginationState } from "@/lib/types";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import PaginationPageButtons from "./PaginationPageButtons";

type TablePaginationProps = {
  totalPages: number;
  pagination: TablePaginationState;
  onUpdatePagination: Dispatch<SetStateAction<TablePaginationState>>;
};
const TablePagination = ({
  totalPages,
  pagination,
  onUpdatePagination,
}: TablePaginationProps) => {
  return (
    <div className="flex w-full flex-col sm:flex-row justify-center sm:justify-end items-center mt-2 py-2 gap-2">
      <div className="items-center flex gap-2">
        <span className="text-sm font-medium whitespace-nowrap">{`Page ${pagination.currentPage} of ${totalPages}`}</span>
        <Select
          value={`${pagination.pageSize}`}
          onValueChange={(value) =>
            onUpdatePagination((prev) => ({
              ...prev,
              pageSize: Number(value),
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <PaginationPageButtons
        className="flex sm:hidden"
        totalPages={totalPages}
        currentPage={pagination.currentPage}
        onChange={(page) =>
          onUpdatePagination((prev) => ({ ...prev, currentPage: page }))
        }
      />
      <div className="flex items-center gap-2">
        <Button
          onClick={() =>
            onUpdatePagination((prev) => ({
              ...prev,
              currentPage: 1,
            }))
          }
          disabled={pagination.currentPage === 1}
        >
          <ChevronsLeftIcon />
        </Button>
        <Button
          onClick={() =>
            onUpdatePagination((prev) => ({
              ...prev,
              currentPage: Math.max(prev.currentPage - 1, 1),
            }))
          }
          disabled={pagination.currentPage === 1}
        >
          <ChevronLeftIcon />
        </Button>
        <PaginationPageButtons
          className="hidden sm:flex"
          totalPages={totalPages}
          currentPage={pagination.currentPage}
          onChange={(page) =>
            onUpdatePagination((prev) => ({ ...prev, currentPage: page }))
          }
        />
        <Button
          onClick={() =>
            onUpdatePagination((prev) => ({
              ...prev,
              currentPage: Math.min(prev.currentPage + 1, totalPages),
            }))
          }
          disabled={pagination.currentPage === totalPages}
        >
          <ChevronRightIcon />
        </Button>
        <Button
          onClick={() =>
            onUpdatePagination((prev) => ({
              ...prev,
              currentPage: totalPages,
            }))
          }
          disabled={pagination.currentPage === totalPages}
        >
          <ChevronsRightIcon />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
