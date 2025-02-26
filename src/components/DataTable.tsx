import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { DataItemTable } from "@/types";
import parseFileSize from "@/utils/parseFileSize";
interface DataTableProps {
  data: DataItemTable[];
  setData: (data: DataItemTable[]) => void;
  visibleColumns: string[];
}

export default function DataTable({
  data,
  setData,
  visibleColumns,
}: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sortedData = [...data].sort((a, b) => {
      if (column === "frame_size_total_bytes") {
        const sizeA = parseFileSize(String(a[column]));
        const sizeB = parseFileSize(String(b[column]));
        return sortDirection === "asc" ? sizeA - sizeB : sizeB - sizeA;
      }

      if (column === "tag_obj" || column === "tag_esc") {
        return sortDirection === "asc"
          ? a[column].join(",").localeCompare(b[column].join(","))
          : b[column].join(",").localeCompare(a[column].join(","));
      }
      const firstElement = a[column as keyof DataItemTable];
      const secondElement = b[column as keyof DataItemTable];
      if (firstElement !== undefined && secondElement !== undefined) {
        if (firstElement < secondElement)
          return sortDirection === "asc" ? -1 : 1;
        if (firstElement > secondElement)
          return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
    setData(sortedData);
  };

  const renderCellContent = (item: DataItemTable, column: keyof DataItemTable): React.ReactNode => {
    if (column === "tag_obj" || column === "tag_esc") {
      return (
        <div className="flex flex-wrap gap-1">
          {item[column].map((tag: string, index: number) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      );
    }
    // if (column === "virtual_scene" || column === "real_scene") {
    //   return item[column] ? "Yes" : "No";
    // }
    if (column === "frames_quantity") {
      return item[column] !== undefined ? Math.round(item[column]) : 0;
    }
    if (item[column] instanceof Date) {
      return (item[column] as Date).toLocaleDateString();
    }
    return String(item[column]);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {visibleColumns.map((column) => (
            <TableHead key={column}>
              <Button variant="ghost" onClick={() => handleSort(column)}>
                {column}
                {sortColumn === column && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            {visibleColumns.map((column) => (
              <TableCell key={column}>
                {renderCellContent(item, column as keyof DataItemTable)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
