"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MetricLineChartProps {
  data: { name: string; [key: string]: string }[];
}

export default function MetricLineChart({ data }: MetricLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" height={80} interval={0} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="NeRF"
          name="NeRF"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          connectNulls={true}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="Gaussian"
          name="Gaussian"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          connectNulls={true}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
