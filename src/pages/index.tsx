"use client";

import { useEffect, useState } from "react";
import { EXPERIMENT_URL } from "@/routes/routes";
import { useQuery } from "react-query";
import { fetchData } from "@/services/api";
import {
  Request,
  TagEsc,
  TagObj,
  DataItemRequest,
  DataItemTable,
} from "@/types/index";
import {
  METRIC_TABLES,
  metricsKeys,
  OBJECT_MAPPING,
  SCENE_MAPPING,
} from "@/constants";
import CategoryMetricsTable from "@/components/MetricTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BaseTable from "@/components/BaseTable";
import { Loader2Icon, LoaderIcon } from "lucide-react";
import noDataFound from "@/assets/images/nodata.png";
import Image from "next/image";
import useGetExperiments from "@/hooks/useGetExperiments";
import getFormattedItems from "@/utils/initialFormatter";

export default function Home() {
  const [data, setData] = useState<DataItemTable[]>([]);
  const [groupBy, setGroupBy] = useState<string | null>(null);
  const { data: items, error, isLoading } = useGetExperiments();
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [aggregations, setAggregations] =
    useState<typeof metricsKeys>(metricsKeys);

  useEffect(() => {
    if (!items || !items.length) return;
    const newItems = getFormattedItems(items);
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

  if (isLoading || !data.length || error) {
    const message = error ? `Error: ${error.message}` : "Sin data";
    return (
      <div className="flex justify-center items-center h-screen text-neutral-600">
        {isLoading ? (
          <Loader2Icon className="animate-spin h-14 w-14"></Loader2Icon>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <Image
              width={600}
              height={400}
              src={noDataFound.src}
              alt="No data found"
            />
            <span className="mt-[-10rem]">{message}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <main className="container mx-auto p-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold">Aplicación de Análisis</h1>
        <Tabs defaultValue="main-view" className="w-full">
          <TabsList className="grid w-full grid-cols-3 gap-2">
            <TabsTrigger value="main-view">Tabla principal</TabsTrigger>
            <TabsTrigger value="preprocessor">
              Tabla de Métricas de Preprocesadores
            </TabsTrigger>
            <TabsTrigger value="model">
              Tabla de Métricas de Modelos de IA
            </TabsTrigger>
          </TabsList>
          <TabsContent value="main-view">
            <BaseTable
              data={data}
              setData={setData}
              visibleColumns={visibleColumns}
              aggregations={aggregations}
              handleAggregationsChange={handleAggregationsChange}
              handleColumnChange={handleColumnChange}
              groupBy={groupBy}
              setGroupBy={setGroupBy}
            />
          </TabsContent>
          {METRIC_TABLES.filter(
            ({ key }) => key === "model" || key === "preprocessor"
          ).map(({ key, label, metrics, categoryKeys }) => (
            <TabsContent value={key} key={key}>
              <h2 className="text-xl font-semibold mb-4">{label}</h2>
              <CategoryMetricsTable
                data={items || []}
                metrics={metrics}
                categories={categoryKeys}
                mainFilter={key as "model" | "preprocessor"}
              />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </>
  );
}
