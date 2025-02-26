"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/DataTable";
import GroupedView from "@/components/GroupedView";
import ControlPanel from "@/components/ControlPanel";
import ColumnSelector from "@/components/ColumnSelector";
import { EXPERIMENT_URL } from "@/routes/routes";
import { useQuery } from "react-query";
import { fetchData } from "@/services/api";

const CATEGORY_MAPPING = {
  SCENE_OPEN: "open_scene",
  SCENE_CLOSED: "closed_scene",
  OBJ_OPAQUE: "opaque_obj",
  OBJ_TRANSPARENT: "transparent_obj",
};

const { SCENE_OPEN, SCENE_CLOSED, OBJ_OPAQUE, OBJ_TRANSPARENT } =
  CATEGORY_MAPPING;

const SCENE_MAPPING = {
  [SCENE_OPEN]: {
    key: SCENE_OPEN,
    label: "Escena abierta",
  },
  [SCENE_CLOSED]: {
    key: SCENE_CLOSED,
    label: "Escena cerrada",
  },
};

const OBJECT_MAPPING = {
  [OBJ_OPAQUE]: {
    key: OBJ_OPAQUE,
    label: "Objeto opaco",
  },
  [OBJ_TRANSPARENT]: {
    key: OBJ_TRANSPARENT,
    label: "Objeto transparente",
  },
};

export type TagEsc = typeof SCENE_OPEN | typeof SCENE_CLOSED;
export type TagObj = typeof OBJ_OPAQUE | typeof OBJ_TRANSPARENT;

export const metricsKeys = [
  "psnr",
  "psnr_std",
  "ssim",
  "ssim_std",
  "lpips",
  "lpips_std",
  "preprocesing_time_s",
  "training_time_s",
  "evaluation_time_s",
  "num_rays_per_sec",
  "num_rays_per_sec_std",
  "fps",
  "fps_std",
  "frames_quantity",
  "frame_size_total_bytes",
  "frame_size_avg_bytes",
] as const;

export type Metrics = {
  [K in (typeof metricsKeys)[number]]?: number;
};

export type FileType = "image" | "video";
export type ModelType = "NeRF" | "Gaussian";
export type PreprocessorType = "COLMAP" | "HLOC";

export type DataItem = Metrics & {
  id: number;
  title: string;
  dataset: string;
  type: FileType;
  model: ModelType;
  preprocessor: PreprocessorType;
  virtual_scene: boolean;
  real_scene: boolean;
  date_added: Date;
  date_updated: Date;
};

export type DataItemRequest = DataItem & {
  opaque_obj: boolean;
  transparent_obj: boolean;
  open_scene: boolean;
  closed_scene: boolean;
  preprocessed: boolean;
  trained: boolean;
  evaluated: boolean;
  successful: boolean;
  error: string;
  raw_data: object;
};

export type DataItemTable = DataItem & {
  tag_obj: TagObj[];
  tag_esc: TagEsc[];
};

export interface Request {
  items: DataItemRequest[];
  total: number;
}

const getKeys = <T extends {}>() => {
  return (Object.keys({} as T) as Array<keyof T>).map((key) => key as string);
};

// Sample data

// const initialData: DataItem[] = [
//   {
//     title: "Project A",
//     dataset: "Dataset 1",
//     blended: true,
//     frames_quantity: 100,
//     format: "image",
//     frame_size_avg_bytes: "4.34 MB",
//     real: true,
//     tag_obj: ["standard object", "object with depth"],
//     tag_esc: ["open scene"],
//     PSNR: 32.5,
//     LPIPS: 0.15,
//     SSIM: 0.92,
//   },
//   {
//     title: "Project B",
//     dataset: "Dataset 2",
//     blended: false,
//     frames_quantity: 50,
//     format: "video",
//     frame_size_avg_bytes: "10.5 GB",
//     real: false,
//     tag_obj: ["object with transparency"],
//     tag_esc: ["closed scene"],
//     PSNR: 30.2,
//     LPIPS: 0.18,
//     SSIM: 0.89,
//   },
//   {
//     title: "Project C",
//     dataset: "Dataset 1",
//     blended: true,
//     frames_quantity: 75,
//     format: "image",
//     frame_size_avg_bytes: "2.1 MB",
//     real: true,
//     tag_obj: ["standard object"],
//     tag_esc: ["open scene", "closed scene"],
//     PSNR: 28.7,
//     LPIPS: 0.21,
//     SSIM: 0.85,
//   },
//   {
//     title: "Project D",
//     dataset: "Dataset 3",
//     blended: false,
//     frames_quantity: 200,
//     format: "video",
//     frame_size_avg_bytes: "8.7 GB",
//     real: true,
//     tag_obj: ["object with depth", "object with transparency"],
//     tag_esc: ["closed scene"],
//     PSNR: 31.1,
//     LPIPS: 0.17,
//     SSIM: 0.91,
//   },
//   {
//     title: "Project E",
//     dataset: "Dataset 2",
//     blended: true,
//     frames_quantity: 150,
//     format: "image",
//     frame_size_avg_bytes: "3.5 MB",
//     real: false,
//     tag_obj: ["standard object", "object with transparency"],
//     tag_esc: ["open scene"],
//     PSNR: 33.8,
//     LPIPS: 0.12,
//     SSIM: 0.94,
//   },
//   {
//     title: "Project F",
//     dataset: "Dataset 3",
//     blended: true,
//     frames_quantity: 80,
//     format: "video",
//     frame_size_avg_bytes: "5.2 GB",
//     real: true,
//     tag_obj: ["object with depth"],
//     tag_esc: ["closed scene"],
//     PSNR: 29.5,
//     LPIPS: 0.19,
//     SSIM: 0.88,
//   },
//   {
//     title: "Project G",
//     dataset: "Dataset 1",
//     blended: false,
//     frames_quantity: 120,
//     format: "image",
//     frame_size_avg_bytes: "1.8 MB",
//     real: false,
//     tag_obj: ["standard object", "object with depth"],
//     tag_esc: ["open scene"],
//     PSNR: 34.2,
//     LPIPS: 0.11,
//     SSIM: 0.95,
//   },
//   {
//     title: "Project H",
//     dataset: "Dataset 2",
//     blended: true,
//     frames_quantity: 90,
//     format: "video",
//     frame_size_avg_bytes: "7.3 GB",
//     real: true,
//     tag_obj: ["object with transparency"],
//     tag_esc: ["closed scene", "open scene"],
//     PSNR: 30.8,
//     LPIPS: 0.16,
//     SSIM: 0.9,
//   },
// ];

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

  console.log("aggregations", aggregations);

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
      );
      const tag_escs = Object.keys(SCENE_MAPPING).filter(
        (i) => item[i as keyof DataItemRequest]
      );
      return {
        ...rest,
        tag_obj: tag_objs,
        tag_esc: tag_escs,
      };
    });
    setData(newItems);
    setVisibleColumns(Object.keys(newItems[0]));
  }, [items]);

  const handleColumnChange = (selectedColumns: string[]) => {
    setVisibleColumns(
      data[0] ? Object.keys(data[0]).filter((col) => selectedColumns.includes(col)) : selectedColumns
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
    // <div>
    //   <h1>Data:</h1>
    //   <pre>{JSON.stringify(data, null, 2)}</pre>
    // </div>
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
