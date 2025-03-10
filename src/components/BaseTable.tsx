"use client";

import DataTable from "@/components/DataTable";
import GroupedView from "@/components/GroupedView";
import ControlPanel from "@/components/ControlPanel";
import { DataItemTable } from "@/types/index";
import { metricsKeys, TABLE_MAPPING } from "@/constants";

interface BaseTableProps {
  data: DataItemTable[];
  setData: (data: DataItemTable[]) => void;
  visibleColumns: string[];
  aggregations: typeof metricsKeys;
  handleAggregationsChange: (selectedAggregations: string[]) => void;
  handleColumnChange: (selectedColumns: string[]) => void;
  groupBy: string | null;
  setGroupBy: (value: string | null) => void;
}

export default function BaseTable({
  data,
  setData,
  visibleColumns,
  aggregations,
  handleAggregationsChange,
  handleColumnChange,
  groupBy,
  setGroupBy,
}: BaseTableProps) {
  return (
    <>
      <div className="space-y-4">
        <ControlPanel
          fields={Object.keys(TABLE_MAPPING) as (keyof typeof TABLE_MAPPING)[]}
          metrics={metricsKeys}
          onGroupByChange={setGroupBy}
          onAggregationsChange={handleAggregationsChange}
          aggregations={aggregations}
          groupBy={groupBy}
          visibleColumns={visibleColumns}
          handleColumnChange={handleColumnChange}
        />
      </div>
      <h2 className="text-xl font-semibold mb-4 pt-8">Tabla Principal</h2>
      <div className="bg-white rounded-lg shadow-md p-4 mt-4">
        {groupBy ? (
          <GroupedView
            data={data}
            groupBy={groupBy}
            aggregations={aggregations}
            visibleColumns={visibleColumns}
          />
        ) : (
          <DataTable
            data={data}
            setData={setData}
            visibleColumns={visibleColumns}
          />
        )}
      </div>
    </>
  );
}
