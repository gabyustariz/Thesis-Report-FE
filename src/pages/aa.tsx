"use client";

import { useCallback, useEffect, useState } from "react";
import DataTable from "@/components/DataTable";
import GroupedView from "@/components/GroupedView";
import ControlPanel from "@/components/ControlPanel";
import ColumnSelector from "@/components/ColumnSelector";
import useFetchData from "@/hooks/useFecthData";
import { EXPERIMENT_URL } from "@/routes/routes";
import { useQuery } from "react-query";
import { fetchData } from "@/services/api";

type TagObj =
  | "standard object"
  | "object with depth"
  | "object with transparency";
type TagEsc = "open scene" | "closed scene";

export interface DataItem {
  // title: string;
  // dataset: string;
  // blended: boolean;
  // frames_quantity: number;
  // format: "video" | "image";
  // frame_size_avg_bytes: string;
  // real: boolean;
  // tag_obj: TagObj[];
  // tag_esc: TagEsc[];
  // PSNR: number;
  // LPIPS: number;
  // SSIM: number;
  [key: string]: any;
}

// Sample data

const initialData: DataItem[] = [
  {
    title: "Project A",
    dataset: "Dataset 1",
    blended: true,
    frames_quantity: 100,
    format: "image",
    frame_size_avg_bytes: "4.34 MB",
    real: true,
    tag_obj: ["standard object", "object with depth"],
    tag_esc: ["open scene"],
    PSNR: 32.5,
    LPIPS: 0.15,
    SSIM: 0.92,
  },
  {
    title: "Project B",
    dataset: "Dataset 2",
    blended: false,
    frames_quantity: 50,
    format: "video",
    frame_size_avg_bytes: "10.5 GB",
    real: false,
    tag_obj: ["object with transparency"],
    tag_esc: ["closed scene"],
    PSNR: 30.2,
    LPIPS: 0.18,
    SSIM: 0.89,
  },
  {
    title: "Project C",
    dataset: "Dataset 1",
    blended: true,
    frames_quantity: 75,
    format: "image",
    frame_size_avg_bytes: "2.1 MB",
    real: true,
    tag_obj: ["standard object"],
    tag_esc: ["open scene", "closed scene"],
    PSNR: 28.7,
    LPIPS: 0.21,
    SSIM: 0.85,
  },
  {
    title: "Project D",
    dataset: "Dataset 3",
    blended: false,
    frames_quantity: 200,
    format: "video",
    frame_size_avg_bytes: "8.7 GB",
    real: true,
    tag_obj: ["object with depth", "object with transparency"],
    tag_esc: ["closed scene"],
    PSNR: 31.1,
    LPIPS: 0.17,
    SSIM: 0.91,
  },
  {
    title: "Project E",
    dataset: "Dataset 2",
    blended: true,
    frames_quantity: 150,
    format: "image",
    frame_size_avg_bytes: "3.5 MB",
    real: false,
    tag_obj: ["standard object", "object with transparency"],
    tag_esc: ["open scene"],
    PSNR: 33.8,
    LPIPS: 0.12,
    SSIM: 0.94,
  },
  {
    title: "Project F",
    dataset: "Dataset 3",
    blended: true,
    frames_quantity: 80,
    format: "video",
    frame_size_avg_bytes: "5.2 GB",
    real: true,
    tag_obj: ["object with depth"],
    tag_esc: ["closed scene"],
    PSNR: 29.5,
    LPIPS: 0.19,
    SSIM: 0.88,
  },
  {
    title: "Project G",
    dataset: "Dataset 1",
    blended: false,
    frames_quantity: 120,
    format: "image",
    frame_size_avg_bytes: "1.8 MB",
    real: false,
    tag_obj: ["standard object", "object with depth"],
    tag_esc: ["open scene"],
    PSNR: 34.2,
    LPIPS: 0.11,
    SSIM: 0.95,
  },
  {
    title: "Project H",
    dataset: "Dataset 2",
    blended: true,
    frames_quantity: 90,
    format: "video",
    frame_size_avg_bytes: "7.3 GB",
    real: true,
    tag_obj: ["object with transparency"],
    tag_esc: ["closed scene", "open scene"],
    PSNR: 30.8,
    LPIPS: 0.16,
    SSIM: 0.9,
  },
];

const fetchExperiments = async (): Promise<DataItem[]> => {
  return fetchData<DataItem[]>(EXPERIMENT_URL);
};

export default function Home() {
  // const [data, setData] = useState<any>(initialData);
  const [groupBy, setGroupBy] = useState<string | null>(null);
  const [data, setData] = useState<DataItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getExperiments = async () => {
      try {
        const experiments = await fetchData<DataItem[]>(EXPERIMENT_URL);
        setData(experiments);
      } catch (err) {
        console.log(err);
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    getExperiments();
  }, []);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as unknown as Error).message}</div>;

  // const [visibleColumns, setVisibleColumns] = useState<string[]>(
  //   Object.keys(initialData[0])
  // );
  // const [aggregations, setAggregations] = useState<string[]>([
  //   "frames_quantity",
  //   "frame_size_avg_bytes",
  //   "PSNR",
  //   "LPIPS",
  //   "SSIM",
  // ]);

  // const handleColumnChange = (selectedColumns: string[]) => {
  //   setVisibleColumns(
  //     Object.keys(initialData[0]).filter((col) => selectedColumns.includes(col))
  //   );
  // };

  // const handleAggregationsChange = (selectedAggregations: string[]) => {
  //   setAggregations(selectedAggregations);
  // };

  return (
    <div>
      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
    // <main className="container mx-auto p-4 space-y-6">
    //   <h1 className="text-2xl font-bold">Data Analysis App</h1>
    //   <div className="space-y-4">
    //     <ControlPanel
    //       fields={Object.keys(initialData[0])}
    //       onGroupByChange={setGroupBy}
    //       onAggregationsChange={handleAggregationsChange}
    //       aggregations={aggregations}
    //     />
    //     <ColumnSelector
    //       columns={Object.keys(initialData[0])}
    //       visibleColumns={visibleColumns}
    //       onColumnChange={handleColumnChange}
    //     />
    //   </div>
    //   <div className="bg-white rounded-lg shadow-md p-4">
    //     {groupBy ? (
    //       <GroupedView
    //         data={data}
    //         groupBy={groupBy}
    //         aggregations={aggregations}
    //         visibleColumns={visibleColumns}
    //       />
    //     ) : (
    //       <DataTable
    //         data={data}
    //         setData={setData}
    //         visibleColumns={visibleColumns}
    //       />
    //     )}
    //   </div>
    // </main>
  );
}
