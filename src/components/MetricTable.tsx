import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Categories, DataItemRequest, Metrics } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORY_MAPPING, TABLE_MAPPING } from "@/constants";
import MetricBarChart from "./MetricBarChart";
import MetricLineChart from "./MetricLineChart";

interface CategoryMetricsTableProps {
  data: DataItemRequest[];
  metrics: (keyof Metrics)[];
  categories: (keyof Categories)[];
  mainFilter: "model" | "preprocessor";
}

export default function CategoryMetricsTable({
  data,
  metrics,
  categories,
  mainFilter,
}: CategoryMetricsTableProps) {
  const [activeMetric, setActiveMetric] = useState(metrics[0]);

  console.log(`ke`, data);

  const models = Array.from(new Set(data.map((item) => item[mainFilter])));
  const calculateAverage = (
    model: string,
    category: keyof Categories,
    metric: (typeof metrics)[number]
  ) => {
    const relevantData = data.filter(
      (item) => item[mainFilter] === model && item[category] && item[metric]
    );
    if (relevantData.length === 0) return "N/A";
    const sum = relevantData.reduce((acc, item) => {
      const m = item[metric] || 0;
      return acc + m;
    }, 0);
    return (sum / relevantData.length).toFixed(2);
  };

  const countExperiments = (category: keyof Categories) => {
    return data.filter((item) => item[category]).length;
  };

  const dataTable: {
    [mainFilter: string]: {
      [metric: string]: {
        [category: string]: string;
      };
    };
  } = useMemo(() => {
    return models.reduce((acc, model) => {
      const metricsDa = metrics.reduce((ac, metric) => {
        const categoriesDa = categories.reduce((a, category) => {
          const average = calculateAverage(model, category, metric);
          return { ...a, [category]: average };
        }, {});
        return {
          ...ac,
          [metric]: categoriesDa,
        };
      }, {});
      return {
        ...acc,
        [model]: metricsDa,
      };
    }, {});
  }, [data, metrics, categories, mainFilter, models]);

  const dataChart: {
    [key: string]: { name: string; [key: string]: string }[];
  } = useMemo(() => {
    return metrics.reduce((acc, metric) => {
      const categoryData = categories.map((category) => {
        const models = Object.entries(dataTable).reduce(
          (acc: { [key: string]: any }, [mainFilter, value]) => {
            console.log(`epale2`, dataTable, value);
            acc[mainFilter] = dataTable[mainFilter][metric][category];
            return acc;
          },
          {}
        );
        return {
          name: TABLE_MAPPING[category],
          ...models,
        };
      });
      return {
        ...acc,
        [metric]: categoryData,
      };
    }, {});
  }, [dataTable]);

  console.log(dataChart);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 mt-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2} className="capitalize">
                {TABLE_MAPPING[mainFilter]}
              </TableHead>
              <TableHead rowSpan={2}>Métrica</TableHead>
              {categories.map((category) => (
                <TableHead key={category} colSpan={1} className="text-center">
                  {CATEGORY_MAPPING[category].label}
                  <br />({countExperiments(category)})
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(dataTable).map(([model, newMetrics]) => (
              <React.Fragment key={model}>
                {Object.entries(
                  newMetrics as { [key: string]: { [key: string]: string } }
                ).map(([metric, categories], index) => (
                  <TableRow key={`${model}-${metric}`}>
                    {index === 0 && (
                      <TableCell rowSpan={metrics.length}>{model}</TableCell>
                    )}
                    <TableCell>
                      {TABLE_MAPPING[metric as keyof typeof TABLE_MAPPING]}
                    </TableCell>
                    {Object.entries(categories).map(([category, average]) => (
                      <TableCell
                        key={`${model}-${metric}-${category}`}
                        className="text-center"
                      >
                        {average}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-8">
        <Tabs
          defaultValue={activeMetric}
          onValueChange={(value) =>
            setActiveMetric(value as (typeof metrics)[number])
          }
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            {metrics.map((metric) => (
              <TabsTrigger key={metric} value={metric}>
                {TABLE_MAPPING[metric]}
              </TabsTrigger>
            ))}
          </TabsList>

          {metrics.map((metric) => (
            <TabsContent key={metric} value={metric} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Bar Chart</h3>
                <div className="h-[400px]">
                  <MetricBarChart data={dataChart[metric]} models={models} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Line Chart</h3>
                <div className="h-[400px]">
                  <MetricLineChart data={dataChart[metric]} models={models} />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
}
