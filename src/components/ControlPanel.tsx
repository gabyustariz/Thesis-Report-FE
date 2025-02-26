import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "./MultiSelect";
import { metricsKeys } from "@/pages";

interface ControlPanelProps {
  fields: string[];
  metrics: typeof metricsKeys;
  onGroupByChange: (value: string | null) => void;
  onAggregationsChange: (value: string[]) => void;
  aggregations: typeof metricsKeys;
}

export default function ControlPanel({
  fields,
  metrics,
  onGroupByChange,
  onAggregationsChange,
  aggregations,
}: ControlPanelProps) {

  console.log("metrics", metrics);
  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      <div className="flex-1 min-w-[180px]">
        <Select
          onValueChange={(value) =>
            onGroupByChange(value === "none" ? null : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No grouping</SelectItem>
            {fields.map((field) => (
              <SelectItem key={field} value={field}>
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[280px]">
        <MultiSelect
          options={[...metrics]}
          selected={[...aggregations]}
          onChange={onAggregationsChange}
          placeholder="Select aggregations"
        />
      </div>
    </div>
  );
}
