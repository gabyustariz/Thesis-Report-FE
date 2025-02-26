"use client";

import { useMemo, useState } from "react";
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
import { ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react";
import type { DataItem, DataItemTable, metricsKeys } from "../pages/index";
import React from "react";

interface GroupedViewProps {
  data: DataItem[];
  groupBy: string;
  aggregations: typeof metricsKeys;
  visibleColumns: string[];
}

const parseFileSize = (size: string): number => {
  console.log("size", size);
  const [value, unit] = size.split(" ");
  const numericValue = Number.parseFloat(value);
  switch (unit.toUpperCase()) {
    case "KB":
      return numericValue * 1024;
    case "MB":
      return numericValue * 1024 * 1024;
    case "GB":
      return numericValue * 1024 * 1024 * 1024;
    default:
      return numericValue;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes.toFixed(2)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const formatValue = (value: any, field: string): React.ReactNode => {
  if (field === "frame_size_avg_bytes") return value;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((tag, index) => (
          <Badge key={index} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    );
  }
  if (field === "frames_quantity") return Math.round(value);
  if (typeof value === "number") return value.toFixed(2);
  return String(value);
};

export default function GroupedView({
  data,
  groupBy,
  aggregations,
  visibleColumns,
}: GroupedViewProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );

  const groupedData = useMemo(() => {
    let groups: Record<string, DataItem[]> = {};

    if (groupBy === "tag_obj" || groupBy === "tag_esc") {
      const allTags = new Set(data.flatMap((item) => item[groupBy as keyof DataItem]));
      allTags.forEach((tag) => {
        groups[tag as string] = data.filter((item) => {
          const groupValue = item[groupBy as keyof DataItem];
          return groupValue && Array.isArray(groupValue) && groupValue.includes(tag);
        });
      });
    } else {
      groups = data.reduce((acc, item) => {
        const key = Array.isArray(item[groupBy as keyof DataItem] as any)
          ? (item[groupBy as keyof DataItem] as string[] | undefined)?.join(", ") ?? ""
          : String(item[groupBy as keyof DataItem]);
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {} as Record<string, DataItem[]>);
    }

    return Object.entries(groups).map(([key, items]) => {
      const result: Record<string, any> = { [groupBy]: key, items };
      aggregations.forEach((agg) => {
        let values: number[];
        if (agg === "frame_size_avg_bytes") {
          values = items.map((item) => parseFileSize((item as any)[agg]));
        } else {
          values = items
            .map((item) => Number(item[agg]))
            .filter((v) => !isNaN(v));
        }
        result.avg = result.avg || {};
        result.min = result.min || {};
        result.max = result.max || {};
        result.avg[agg] = values.reduce((a, b) => a + b, 0) / values.length;
        result.min[agg] = Math.min(...values);
        result.max[agg] = Math.max(...values);
      });
      return result;
    });
  }, [data, groupBy, aggregations]);

  const columns = visibleColumns.filter(
    (col) => col !== groupBy && col !== "frame_size_avg_bytes"
  );

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortItems = (items: DataItem[]) => {
    if (!sortColumn) return items;

    return [...items].sort((a, b) => {
      if (sortColumn === "frame_size_avg_bytes") {
        const sizeA = parseFileSize(String(a[sortColumn]));
        const sizeB = parseFileSize(String(b[sortColumn]));
        return sortDirection === "asc" ? sizeA - sizeB : sizeB - sizeA;
      }

      if ((a[sortColumn as keyof DataItem] ?? 0) < (b[sortColumn as keyof DataItem] ?? 0))
        return sortDirection === "asc" ? -1 : 1;
      if ((a[sortColumn as keyof DataItem] ?? 0) > (b[sortColumn as keyof DataItem] ?? 0))
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="w-[200px]">{groupBy}</TableHead>
            {columns.map((col) => (
              <TableHead key={col} className="px-2 py-3 text-center">
                <Button
                  variant="ghost"
                  onClick={() => handleSort(col)}
                  className="h-full w-full flex items-center justify-center"
                >
                  <span className="mr-1">{col}</span>
                  {sortColumn === col && <ArrowUpDown className="h-4 w-4" />}
                </Button>
              </TableHead>
            ))}
            {visibleColumns.includes("frame_size_avg_bytes") && (
              <TableHead className="px-2 py-3 text-center">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("frame_size_avg_bytes")}
                  className="h-full w-full flex items-center justify-center"
                >
                  <span className="mr-1">frame_size_avg_bytes</span>
                  {sortColumn === "frame_size_avg_bytes" && (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </Button>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedData.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              <TableRow className="font-medium hover:bg-muted/50">
                <TableCell className="w-[200px]">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 mr-2"
                      onClick={() => toggleGroup(group[groupBy])}
                    >
                      {expandedGroups[group[groupBy]] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <span className="mr-2">
                      {formatValue(group[groupBy], groupBy)}
                    </span>
                    <Badge variant="secondary" className="ml-auto">
                      {group.items.length}
                    </Badge>
                  </div>
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={col} className="text-center">
                    {aggregations.includes(col) ? (
                      <span
                        title={`Min: ${formatValue(
                          group.min[col],
                          col
                        )}, Max: ${formatValue(group.max[col], col)}`}
                      >
                        {formatValue(group.avg[col], col)}
                      </span>
                    ) : (
                      ""
                    )}
                  </TableCell>
                ))}
                {visibleColumns.includes("frame_size_avg_bytes") && (
                  <TableCell className="text-center">
                    {aggregations.includes("frame_size_avg_bytes") ? (
                      <span
                        title={`Min: ${formatFileSize(
                          group.min["frame_size_avg_bytes"]
                        )}, Max: ${formatFileSize(group.max["frame_size_avg_bytes"])}`}
                      >
                        {formatFileSize(group.avg["frame_size_avg_bytes"])}
                      </span>
                    ) : (
                      ""
                    )}
                  </TableCell>
                )}
              </TableRow>
              {expandedGroups[group[groupBy]] && (
                <>
                  {sortItems(group.items).map(
                    (item: DataItem, itemIndex: number) => (
                      <TableRow
                        key={`${groupIndex}-${itemIndex}`}
                        className="hover:bg-muted/30"
                      >
                        <TableCell className="pl-10">-</TableCell>
                        {columns.map((col) => (
                          <TableCell key={col} className="text-center">
                            {formatValue(item[col], col)}
                          </TableCell>
                        ))}
                        {visibleColumns.includes("frame_size_avg_bytes") && (
                          <TableCell className="text-center">
                            {item.frame_size_avg_bytes}
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  )}
                </>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
