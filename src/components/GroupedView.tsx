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
import React from "react";
import { DataItemTable, Metrics } from "@/types";
import { metricsKeys } from "@/constants";

interface GroupedViewProps {
  data: DataItemTable[];
  groupBy: string;
  aggregations: typeof metricsKeys;
  visibleColumns: string[];
}

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
    let groups: Record<string, DataItemTable[]> = {};

    if (groupBy === "tag_obj" || groupBy === "tag_esc") {
      const allTags = new Set(
        data.flatMap((item) => item[groupBy as keyof DataItemTable])
      );
      allTags.forEach((tag) => {
        groups[tag as string] = data.filter((item) => {
          const groupValue = item[groupBy as keyof DataItemTable];
          return (
            groupValue &&
            Array.isArray(groupValue) &&
            (groupValue as string[]).includes(tag as string)
          );
        });
      });
    } else {
      groups = data.reduce((acc, item) => {
        const key = Array.isArray(item[groupBy as keyof DataItemTable] as any)
          ? (
              item[groupBy as keyof DataItemTable] as string[] | undefined
            )?.join(", ") ?? ""
          : String(item[groupBy as keyof DataItemTable]);
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {} as Record<string, DataItemTable[]>);
    }

    return Object.entries(groups).map(([key, items]) => {
      const result: Record<string, any> = { [groupBy]: key, items };
      aggregations.forEach((agg) => {
        let values: number[];
        values = items
          .map((item) => Number(item[agg as keyof DataItemTable]))
          .filter((v) => !isNaN(v));
        result.avg = result.avg || {};
        result.min = result.min || {};
        result.max = result.max || {};
        result.avg[agg] = values.reduce((a, b) => a + b, 0) / values.length;
        result.min[agg] = Math.min(...values);
        result.max[agg] = Math.max(...values);
      });
      console.log(result);
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

  const sortItems = (items: DataItemTable[]) => {
    if (!sortColumn) return items;

    return [...items].sort((a, b) => {
      if (sortColumn === "frame_size_avg_bytes") {
        const sizeA = a[sortColumn] || 0;
        const sizeB = b[sortColumn] || 0;
        return sortDirection === "asc" ? sizeA - sizeB : sizeB - sizeA;
      }

      if (
        (a[sortColumn as keyof DataItemTable] ?? 0) <
        (b[sortColumn as keyof DataItemTable] ?? 0)
      )
        return sortDirection === "asc" ? -1 : 1;
      if (
        (a[sortColumn as keyof DataItemTable] ?? 0) >
        (b[sortColumn as keyof DataItemTable] ?? 0)
      )
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
                    {aggregations.includes(col as keyof Metrics) ? (
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
                        )}, Max: ${formatFileSize(
                          group.max["frame_size_avg_bytes"]
                        )}`}
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
                    (item: DataItemTable, itemIndex: number) => (
                      <TableRow
                        key={`${groupIndex}-${itemIndex}`}
                        className="hover:bg-muted/30"
                      >
                        <TableCell className="pl-10">-</TableCell>
                        {columns.map((col) => (
                          <TableCell key={col} className="text-center">
                            {formatValue(item[col as keyof DataItemTable], col)}
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
