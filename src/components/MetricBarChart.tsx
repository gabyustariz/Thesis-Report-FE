"use client";

import { DataItemRequest } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MetricBarChartProps {
  data: { name: string; [key: string]: string }[];
  models: string[];
}

export default function MetricBarChart({ data, models }: MetricBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        // margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          height={80}
          interval={0}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        {models. map((model, index) => (
          <Bar
            key={index}
            dataKey={model}
            name={model}
            fill={`hsl(var(--chart-${index + 1}))`}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
