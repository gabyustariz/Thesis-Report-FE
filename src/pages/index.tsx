"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/DataTable";
import GroupedView from "@/components/GroupedView";
import ControlPanel from "@/components/ControlPanel";
import ColumnSelector from "@/components/ColumnSelector";
import { EXPERIMENT_URL } from "@/routes/routes";
import { useQuery } from "react-query";
import { fetchData } from "@/services/api";
import {
  metricsKeys,
  Request,
  TagEsc,
  TagObj,
  DataItemRequest,
  DataItemTable,
} from "@/types/index";
import { OBJECT_MAPPING, SCENE_MAPPING } from "@/constants";

const fetchExperiments = async (): Promise<DataItemRequest[]> => {
  const data = await fetchData<Request>(EXPERIMENT_URL);
  return data.items;
};

export default function Home() {
  const [data, setData] = useState<DataItemTable[]>([]);
  const [groupBy, setGroupBy] = useState<string | null>(null);
  const {
    data: items,
    error,
    isLoading,
  } = useQuery<DataItemRequest[], Error>("experiments", fetchExperiments);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [aggregations, setAggregations] =
    useState<typeof metricsKeys>(metricsKeys);

  useEffect(() => {
    if (!items || !items.length) return;
    const newItems = items.map((item) => {
      const {
        opaque_obj,
        transparent_obj,
        open_scene,
        closed_scene,
        preprocessed,
        trained,
        evaluated,
        successful,
        error,
        raw_data,
        ...rest
      } = item;
      const tag_objs = Object.keys(OBJECT_MAPPING).filter(
        (i) => item[i as keyof DataItemRequest]
      ) as TagObj[];
      const tag_escs = Object.keys(SCENE_MAPPING).filter(
        (i) => item[i as keyof DataItemRequest]
      ) as TagEsc[];
      return {
        ...rest,
        tag_obj: tag_objs,
        tag_esc: tag_escs,
      };
    });
    setData(newItems as DataItemTable[]);
    setVisibleColumns(Object.keys(newItems[0]));
  }, [items]);

  const handleColumnChange = (selectedColumns: string[]) => {
    setVisibleColumns(
      data[0]
        ? Object.keys(data[0]).filter((col) => selectedColumns.includes(col))
        : selectedColumns
    );
  };

  const handleAggregationsChange = (selectedAggregations: string[]) => {
    setAggregations(
      selectedAggregations.filter((agg) =>
        metricsKeys.includes(agg as any)
      ) as unknown as typeof metricsKeys
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data.length) return <div>Error: No data</div>;

  return (
    <main className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Data Analysis App</h1>
      <div className="space-y-4">
        <ControlPanel
          fields={Object.keys(data[0])}
          metrics={metricsKeys}
          onGroupByChange={setGroupBy}
          onAggregationsChange={handleAggregationsChange}
          aggregations={aggregations}
        />
        <ColumnSelector
          columns={Object.keys(data[0])}
          visibleColumns={visibleColumns}
          onColumnChange={handleColumnChange}
        />
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
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
    </main>
  );
}
