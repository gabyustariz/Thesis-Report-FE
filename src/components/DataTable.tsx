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
import { formatFileSize } from "@/utils/fileFormatter";
import { formatDate, formatDuration } from "@/utils/timeFormatter";
import { TABLE_MAPPING } from "@/constants";
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
        const sizeA = a[column] || 0;
        const sizeB = b[column] || 0;
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

  const renderCellContent = (
    item: DataItemTable,
    column: keyof DataItemTable
  ): React.ReactNode => {
    if (column === "tag_obj" || column === "tag_esc") {
      return (
        <div className="flex flex-wrap gap-1">
          {item[column].map((tag: string, index: number) => (
            <Badge key={index} variant="secondary">
              {TABLE_MAPPING[tag as keyof typeof TABLE_MAPPING]}
            </Badge>
          ))}
        </div>
      );
    }
    if (column === "virtual_scene" || column === "real_scene") {
      return item[column] ? "Sí" : "No";
    }
    if (
      column === "frame_size_avg_bytes" ||
      column === "frame_size_total_bytes"
    ) {
      return formatFileSize(item[column] || 0);
    }
    if (column === "frames_training_total") {
      return item[column] !== undefined ? Math.round(item[column]) : 0;
    }
    if (
      column === "preprocesing_time_s" ||
      column === "training_time_s" ||
      column === "evaluation_time_s"
    ) {
      return formatDuration(item[column] || 0);
    }
    if (column === "date_added" || column === "date_updated") {
      return formatDate(String(item[column]));
    }
    return String(item[column]);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {visibleColumns.map((column) => (
            <TableHead key={column}>
              <Button
                variant="ghost"
                onClick={() => handleSort(column)}
                className="pl-0"
              >
                {TABLE_MAPPING[column as keyof typeof TABLE_MAPPING]}
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
              <TableCell key={column} className="py-4">
                {renderCellContent(item, column as keyof DataItemTable)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
